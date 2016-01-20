""" This module contains the tool of scoreboard.visualization
"""
from setuptools import setup, find_packages


setup(name='scoreboard.visualization',
      version='0.1',
      description="Scoreboard Visualization",
      classifiers=[
        'Framework :: Plone',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: GNU General Public License (GPL)',
        ],
      keywords='daviz plone zope',
      author='Eau de Web',
      author_email='office@eaudeweb.ro',
      url='http://github.com/eaudeweb',
      license='GPL',
      install_requires=[
        'setuptools',
        'eea.app.visualization',
        'edw.datacube',
        'Jinja2',
        'path.py',
        'simplejson',
        'slimit',
        'xlrd',
        'xlwt',
        'ordereddict'
      ],
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['scoreboard'],
      include_package_data=True,
      zip_safe=False,
      entry_points="""
      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
