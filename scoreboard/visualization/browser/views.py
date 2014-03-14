"""
"""
import json
import urllib
<<<<<<< HEAD
from collective.recaptcha.settings import getRecaptchaSettings
=======
import xlrd
import xlwt
from StringIO import StringIO
>>>>>>> WIP: Implement Import/Export WHITELIST from/to xls
from zope.component import queryUtility
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

    def getLabels(self):
        return ['indicator-group', 'indicator', 'breakdown', 'unit-measure']

    def whitelistJSON(self):
        return json.dumps(self.whitelist)

    def whitelistToXLS(self):
        workbook = xlwt.Workbook()
        sheet = workbook.add_sheet('Sheet1')

        for idx, val in enumerate(self.getLabels()):
            sheet.write(0, idx, val)

        for row, elem in enumerate(self.whitelist):
            for cidx, val in enumerate(elem):
                sheet.write(row+1, cidx, elem[self.getLabels()[cidx]])

        self.request.response.setHeader(
            'Content-Type', 'application/vnd.ms-excel')
        self.request.response.setHeader(
            'Content-Disposition', 'attachment; filename="whitelist.xls"')

        output = StringIO()
        workbook.save(output)
        workbook.save('output.xls')

        output.seek(0)

        return output.read()

    def __call__(self, **kwargs):
        if 'form.submitted' in self.request.form:
            file = self.request.form.get('file')
            ptool = queryUtility(IPropertiesTool)
            stool = getattr(ptool, 'scoreboard_properties', None)
            whitelist = stool.getProperty('WHITELIST', None)

            file.seek(0)

            workbook = xlrd.open_workbook(file_contents=file.read())
            sheet1 = workbook.sheet_by_index(0)

            data = []

            for row in xrange(sheet1.nrows):
                elem = {}
                for idx, val in enumerate(self.getLabels()):
                    elem[val] = sheet1.cell(row, idx).value
                data.append(elem)

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
