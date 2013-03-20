"""Definition of the DataCube content type
"""

from zope.interface import implements

from Products.Archetypes import atapi
from Products.ATContentTypes.content import folder
from Products.ATContentTypes.content import schemata

# -*- Message Factory Imported Here -*-
from scoreboard.visualization.interfaces import IDataCube
from scoreboard.visualization.config import PROJECTNAME, _



DataCubeSchema = folder.ATFolderSchema.copy() + atapi.Schema((
    atapi.TextField(
        'endpoint',
        schemata="default",
        required=True,
        default_content_type='text/plain',
        allowable_content_types=('text/plain',),
        languageIndependent=True,
        widget=atapi.TextAreaWidget(
            label=_(u"Endpoint"),
        )
    ),
    atapi.TextField(
        'dataset',
        schemata="default",
        required=False,
        default_content_type='text/plain',
        allowable_content_types=('text/plain',),
        languageIndependent=True,
        widget=atapi.TextAreaWidget(
            label=_(u"Dataset"),
        )
    ),
))

# Set storage on fields copied from ATFolderSchema, making sure
# they work well with the python bridge properties.

DataCubeSchema['title'].storage = atapi.AnnotationStorage()
DataCubeSchema['description'].storage = atapi.AnnotationStorage()
DataCubeSchema['description'].widget.visible = {'view': 'invisible',
                                                'edit': 'invisible'}
DataCubeSchema['dataset'].widget.visible = {'view': 'invisible',
                                            'edit': 'hidden'}

schemata.finalizeATCTSchema(
    DataCubeSchema,
    folderish=False,
    moveDiscussion=False
)

class DataCube(folder.ATFolder):
    """Description of the Example Type"""
    implements(IDataCube)

    meta_type = "DataCube"
    schema = DataCubeSchema

    title = atapi.ATFieldProperty('title')
    description = atapi.ATFieldProperty('description')

    # -*- Your ATSchema to Python Property Bridges Here ... -*-

atapi.registerType(DataCube, PROJECTNAME)
