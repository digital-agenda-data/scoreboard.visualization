"""
"""
import json
import urllib
import xlrd
import xlwt
from StringIO import StringIO
from collective.recaptcha.settings import getRecaptchaSettings

from zope.component import queryUtility
from Products.CMFCore.utils import getToolByName
from Products.Five.browser import BrowserView
from eea.app.visualization.zopera import IPropertiesTool
from scoreboard.visualization.jsapp import jsapp_html
from scoreboard.visualization.config import EU, WHITELIST

from plone.registry.interfaces import IRegistry
from edw.datacube.interfaces import IDataCubeSettings

from edw.datacube.interfaces import defaults


class TestsView(BrowserView):

    @property
    def JSAPP_URL(self):
        root_url = self.context.portal_url.getPortalObject().absolute_url()
        return root_url + '/++resource++scoreboard-jsapp'

    def jsapp_html(self):
        return jsapp_html(
                DATASOURCE_URL='',
                SCENARIO_URL='',
                DATA_REVISION='',
                CUBE_DIMENSIONS=[],
                JSAPP_URL=self.JSAPP_URL)

class EuropeanUnion(BrowserView):
    """ European Union Countries
    """
    @property
    def eu(self):
        ptool = queryUtility(IPropertiesTool)
        stool = getattr(ptool, 'scoreboard_properties', None)
        if not stool:
            return EU

        eu = stool.getProperty('EU', None)
        if not eu:
            return EU

        try:
            json.loads(eu)
        except Exception:
            return EU
        else:
            return eu

    def __call__(self, **kwargs):
        return json.dumps(self.eu)


class WhiteList(BrowserView):
    """ Whitelisted indicators
    """
    @property
    def whitelist(self):
        ptool = queryUtility(IPropertiesTool)
        stool = getattr(ptool, 'scoreboard_properties', None)
        if not stool:
            return WHITELIST

        whitelist = stool.getProperty('WHITELIST', None)
        if not whitelist:
            return WHITELIST

        try:
            whitelist = json.loads(whitelist)
        except Exception:
            return WHITELIST
        else:
            return whitelist

    def contextualWhitelist(self):
        return self.whitelist.get(self.context.getId(), [])

    def getLabels(self):
        return ['indicator-group', 'indicator', 'breakdown', 'unit-measure']

    def dataCubes(self, query={'portal_type': 'DataCube'}):
        ctool = getToolByName(self.context, 'portal_catalog')
        return ctool(**query)

    def dataSets(self):
        brains = self.dataCubes()
        result = [(brain.getId, brain.Title) for brain in brains]
        result.insert(0, ('', ' - Select Dataset - '))

        return result

    def whitelistJSON(self):
        return json.dumps(self.contextualWhitelist())

    def globalWhitelistJSON(self):
        return json.dumps(self.whitelist)

    def whitelistToXLS(self):
        workbook = xlwt.Workbook()
        sheet = workbook.add_sheet('Sheet1')
        dataset_id = self.context.getId()
        settings = self.whitelist.get(dataset_id)
        if settings:

            for idx, val in enumerate(self.getLabels()):
                sheet.write(0, idx, val)

            for row, elem in enumerate(settings):
                for cidx, val in enumerate(elem):
                    value = elem.get(self.getLabels()[cidx])
                    if value:
                        sheet.write(row+1, cidx, elem.get(self.getLabels()[cidx]))

            self.request.response.setHeader(
                'Content-Type', 'application/vnd.ms-excel')
            self.request.response.setHeader(
                'Content-Disposition', 'attachment; filename="whitelist.xls"')

            output = StringIO()
            workbook.save(output)
            workbook.save('output.xls')

            output.seek(0)

            return output.read()

    def parseXLS(self, xls):
        data = []
        xls.seek(0)

        try:
            workbook = xlrd.open_workbook(file_contents=xls.read())
        except Exception:
            return None

        sheet1 = workbook.sheet_by_index(0)
        for row in xrange(sheet1.nrows):
            elem = {}
            for idx, val in enumerate(self.getLabels()):
                if sheet1.row(row)[idx].ctype != 0:
                    value = sheet1.cell(row, idx).value.strip()
                    if value:
                        elem[val] = value
            if elem:
                data.append(elem)

        return data

    def __call__(self, **kwargs):
        self.error = None
        self.msg = None

        if 'form.submitted' in self.request.form:
            datacubes = [b.getId for b in self.dataCubes()]
            file = self.request.form.get('file')
            dataset = self.request.form.get('datasets')
            if not file:
                self.error = 'Select a spreadsheet file to import'
            elif dataset not in datacubes:
                self.error = 'Wrong datacube selection'
            else:
                ptool = queryUtility(IPropertiesTool)
                stool = getattr(ptool, 'scoreboard_properties', None)

                if not stool:
                    ptool.manage_addPropertySheet(
                        'scoreboard_properties', 'Scoreboard Properties')
                    stool = getattr(ptool, 'scoreboard_properties', None)

                data = self.parseXLS(file)
                if not data:
                    self.error = 'Unable to parse file'
                else:
                    settings = self.whitelist
                    settings[dataset] = data[1:]
                    settings = json.dumps(settings, indent=2)
                    if stool.getProperty('WHITELIST', None):
                        try:
                            stool.manage_changeProperties(WHITELIST=settings)
                        except Exception:
                            self.error = 'Unable to import the spreadsheet'
                    else:
                        stool.manage_addProperty('WHITELIST', settings, 'text')

                    self.msg = 'XLS file imported successfuly!'

        if 'export' in self.request.form:
            dataset = self.request.form.get('datasets')
            if dataset:
                query = {'portal_type': 'DataCube',
                         'id': dataset}
                results = self.dataCubes(query)
                if results:
                    url = results[0].getURL()
                    redirect_url = "%s/@@whitelistToXLS?dataset=%s" % (
                        url, dataset)
                    self.request.response.redirect(redirect_url)
            self.error = "Unable to export whitelist for currently selected dataset"
        return self.index()


class CacheView(BrowserView):

    @property
    def JSAPP_URL(self):
        root_url = self.context.portal_url.getPortalObject().absolute_url()
        return root_url + '/++resource++scoreboard-jsapp'

    def jsapp_html(self):
        return jsapp_html(
                DATASOURCE_URL='',
                SCENARIO_URL='',
                DATA_REVISION='',
                CUBE_DIMENSIONS=[],
                JSAPP_URL=self.JSAPP_URL)


class IndicatorsListing(BrowserView):

    _cubeSettings = None

    @property
    def cubeSettings(self):
        """ Settings
        """
        if self._cubeSettings is None:
            self._cubeSettings = queryUtility(
                    IRegistry).forInterface(IDataCubeSettings, False)
        return self._cubeSettings

    @property
    def defaultSparqlEndpoint(self):
        from_registry = self.cubeSettings.default_user_sparql_endpoint
        if not from_registry:
            return defaults.DEFAULT_USER_SPARQL_ENDPOINT
        return from_registry

    def dataset_details(self):
        last_group = ""
        data = self.context.get_cube().get_dataset_details()
        for indicator in data:
            group_name = indicator.get("groupName", "")
            if group_name != last_group:
                last_group = group_name
                yield {"type": "header", "indicator": indicator}
            yield {"type": "row", "indicator": indicator}

    def getIndicatorURLData(self, url_type, indicator):
        notation = indicator.get("notation") or indicator["indicator"]
        indicator = indicator["indicator"]

        data = {
            "notation": notation,
            "indicator": indicator,
        }
        
     
        query = getattr(self.cubeSettings, url_type)
        if not query:
            query = getattr(defaults, url_type.upper())
            
        return "%(endpoint)s?%(params)s" % {
            "endpoint": self.defaultSparqlEndpoint,
            "params": urllib.urlencode({
                "selectedBookmarkName": "",
                "query": query % data,
                "format": "text/html",
                "nrOfHits": 100,
                "execute": "Execute",
            })
        }

class ReCaptchaPubView(BrowserView):
    def __init__(self, context, request):
        self.context = context
        self.request = request
        self.settings = getRecaptchaSettings()

    def __call__(self, **kwargs):
            return self.settings.public_key
