""" Upgrade scripts to version 1.2
"""

import logging
import json
from eea.app.visualization.zopera import IPropertiesTool
from Products.CMFCore.utils import getToolByName
from zope.component import queryUtility

logger = logging.getLogger('scoreboard.visualization')


def migrate_whitelist(context):
    """Migrate whitelist settings to each datacube
    """
    ptool = queryUtility(IPropertiesTool)
    stool = getattr(ptool, 'scoreboard_properties', None)
    ctool = getToolByName(context, 'portal_catalog')
    brains = ctool({'portal_type': 'DataCube'})
    dataset_ids = [b.getId for b in brains]
    c_whitelist = {}

    if stool:
        whitelist = stool.getProperty('WHITELIST', None)
        if whitelist:
            whitelist = json.loads(whitelist)
            for dataset_id in dataset_ids:
                c_whitelist[dataset_id] = whitelist
            if c_whitelist:
                c_whitelist = json.dumps(c_whitelist, indent=2)
                stool.manage_changeProperties(WHITELIST=c_whitelist)
                logger.info('Done migrating whitelist settings!')
