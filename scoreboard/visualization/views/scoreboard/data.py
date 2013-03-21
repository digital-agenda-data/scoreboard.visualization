import time
import simplejson as json
from Products.Five.browser import BrowserView


DATASOURCE_NAME = 'scoreboard-test-cube'  # TODO should not be hardcoded

# DATA_REVISION should be the time of last database modification
DATA_REVISION = str(int(time.time()))


class CubeView(BrowserView):

    def __init__(self, ctx, request):
        super(CubeView, self).__init__(ctx, request)
        self.cube = ctx.aq_parent[DATASOURCE_NAME].get_cube()

    def jsonify(self, data):
        header = self.request.RESPONSE.setHeader
        header("Content-Type", "application/json")
        header("Expires", "Sun, 17-Jan-2038 19:14:07 GMT")
        return json.dumps(data, indent=2, sort_keys=True)

    def dimension_labels(self):
        form = dict(self.request.form)
        dimension = form.pop('dimension')
        value = form.pop('value')
        [labels] = self.cube.get_dimension_labels(dimension, value)
        return self.jsonify(labels)

    def dimension_values(self):
        form = dict(self.request.form)
        form.pop('rev', None)
        dimension = form.pop('dimension')
        filters = sorted(form.items())
        options = self.cube.get_dimension_options(dimension, filters)
        return self.jsonify({'options': options})

    def dimension_values_xy(self):
        form = dict(self.request.form)
        form.pop('rev', None)
        dimension = form.pop('dimension')
        (filters, x_filters, y_filters) = ([], [], [])
        for k, v in sorted(form.items()):
            if k.startswith('x-'):
                x_filters.append((k[2:], v))
            elif k.startswith('y-'):
                y_filters.append((k[2:], v))
            else:
                filters.append((k, v))
        options = self.cube.get_dimension_options_xy(dimension, filters,
                                                     x_filters, y_filters)
        return self.jsonify({'options': options})

    def datapoints(self):
        form = dict(self.request.form)
        form.pop('rev', None)
        fields = form.pop('fields').split(',')
        filters = sorted(form.items())
        rows = list(self.cube.get_data(fields=fields, filters=filters))
        return self.jsonify({'datapoints': rows})

    def datapoints_xy(self):
        form = dict(self.request.form)
        form.pop('rev', None)
        columns = form.pop('columns').split(',')
        xy_columns = form.pop('xy_columns').split(',')
        (filters, x_filters, y_filters) = ([], [], [])
        for k, v in sorted(form.items()):
            if k.startswith('x-'):
                x_filters.append((k[2:], v))
            elif k.startswith('y-'):
                y_filters.append((k[2:], v))
            else:
                filters.append((k, v))
        rows = list(self.cube.get_data_xy(columns=columns,
                                          xy_columns=xy_columns,
                                          filters=filters,
                                          x_filters=x_filters,
                                          y_filters=y_filters))
        return self.jsonify({'datapoints': rows})
