import os
from slimit import minify

PATH = os.path.join(os.path.dirname(__file__), 'jsapp')


js_bundles = [
    {
        'output': 'jsapp.min.js',
        'minify': False,
        'input': [
            'common/common.js',
            'filters/filters.js',
            'chart/columns.js',
            'chart/country_profile.js',
            'chart/lines.js',
            'chart/scatter.js',
            'chart/bubbles.js',
            'chart/polar.js',
            'chart/country_profile_polar.js',
            'chart/map.js',
            'scenario/scenario.js',
            'samples/country_profile_bar.js',
            'samples/country_profile_table.js',
            'scenario/visualization.js',
            'editor/editor.js',
            'editor/chart_type.js',
            'editor/structure.js',
            'editor/facets.js',
            'editor/layout.js',
            'editor/axes.js',
            'editor/series.js',
            'editor/format.js',
            'editor/annotations.js',
            'editor/advanced.js',
        ]
    }
]

def bundleJS(bundle):
    combined = []
    print 'Bundling: ', bundle['input']
    for filePath in bundle['input']:
        fullFilePath = os.path.join(PATH, filePath)
        with open(fullFilePath, 'rb') as f:
            combined.append(f.read())
    outputPath = os.path.join(PATH, bundle['output'])
    output = '\n'.join(combined)
    if bundle['minify'] is True:
        output = minify(output, mangle=True)
    with open(outputPath, 'wb') as f:
        f.write(output)
    print 'Done, output: ', outputPath



def run():
    for bundle in js_bundles:
        bundleJS(bundle)
