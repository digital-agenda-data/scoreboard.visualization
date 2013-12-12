"""
"""
import json
from zope.component import queryUtility
from Products.Five.browser import BrowserView
from eea.app.visualization.zopera import IPropertiesTool
from scoreboard.visualization.jsapp import jsapp_html
from scoreboard.visualization.config import EU, WHITELIST

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

    def __call__(self, **kwargs):
        return json.dumps(self.whitelist)

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
    def dataset_details(self):
        last_group = ""
        data = self.context.get_cube().get_dataset_details()
        for indicator in data:
            group_name = indicator["groupName"]
            if group_name != last_group:
                last_group = group_name
                yield {"type": "header", "indicator": indicator}
            yield {"type": "row", "indicator": indicator}
