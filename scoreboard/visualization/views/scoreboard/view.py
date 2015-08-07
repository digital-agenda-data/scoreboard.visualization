""" Tiles view module
"""
import json
from zope.interface import implements
from zope.component import queryMultiAdapter
from eea.app.visualization.views.view import ViewForm
from edw.datacube.interfaces import IDataCube
from .interfaces import IScoreboardView
from scoreboard.visualization import jsapp
from Products.CMFCore.utils import getToolByName

def get_source(visualization):
    for source in visualization.getRelatedItems():
        if IDataCube.providedBy(source):
            return source
    return None

def jsapp_html_for_visualization(visualization):
    source = get_source(visualization)

    if not source:
        return "No data source available"

    root_url = visualization.portal_url.getPortalObject().absolute_url()
    JSAPP_URL = root_url + '/++resource++scoreboard-jsapp'
    cube = source.get_cube()
    return jsapp.jsapp_html(DATASOURCE_URL=source.absolute_url(),
                            SCENARIO_URL=visualization.absolute_url(),
                            DATA_REVISION=cube.get_revision(),
                            CUBE_DIMENSIONS=cube.get_dimensions(flat=True),
                            JSAPP_URL=JSAPP_URL)

def source_workflow_state(visualization):
    state = 'private'
    source = get_source(visualization)

    if not source:
        return state

    workflowTool = getToolByName(visualization, "portal_workflow")
    status = workflowTool.getStatusOf("simple_publication_workflow", source)
    state = status["review_state"]
    return state

class View(ViewForm):
    """ Tile view
    """
    _label = 'Scoreboard View'
    implements(IScoreboardView)

    @property
    def label(self):
        """ View title
        """
        return self.data.get('title', '') or self._label

    @property
    def config(self):
        return self.data.get('configuration', '{}')

    def config_json(self):
        view = queryMultiAdapter((self.context, self.request), name=u"scoreboard.highchart")
        return view.config

    def jsapp_html(self):
        return jsapp_html_for_visualization(self.context)

    def source_state(self):
        state = source_workflow_state(self.context)
        return state
