""" DataCube vocabulary
"""
from zope.interface import implements
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleVocabulary
from zope.schema.vocabulary import SimpleTerm
from Products.CMFCore.utils import getToolByName

class DataCubeVocabulary(object):
    """ All DataCube object
    """
    implements(IVocabularyFactory)

    def __call__(self, context):
        ctool = getToolByName(context, 'portal_catalog')
        if not ctool:
            return SimpleVocabulary([])

        brains = ctool(portal_type='DataCube')
        items = []
        for brain in brains:
            items.append(SimpleTerm(brain.UID, brain.UID, brain.Title))
        return SimpleVocabulary(items)
