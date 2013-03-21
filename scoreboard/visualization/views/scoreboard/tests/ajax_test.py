from mock import Mock, MagicMock, call
import simplejson as json
import pytest


def ajax(cube, name, form):
    from scoreboard.visualization.views.scoreboard import data
    datasource = Mock(get_cube=Mock(return_value=cube))
    ctx = Mock(aq_parent={'scoreboard-test-cube': datasource})
    view = data.CubeView(ctx, Mock(form=form))
    return json.loads(getattr(view, name)())


@pytest.fixture()
def mock_cube(request):
    from scoreboard.visualization.data.cube import Cube
    return MagicMock(spec=Cube)


def test_dimension_all_indicator_values(mock_cube):
    mock_cube.get_dimension_options.return_value = [
        {'label': 'indicator one', 'notation': 'one'},
        {'label': 'indicator two', 'notation': 'two'},
    ]
    res = ajax(mock_cube, 'dimension_values', {'dimension': 'indicator'})
    assert {'label': 'indicator one', 'notation': 'one'} in res['options']
    assert {'label': 'indicator two', 'notation': 'two'} in res['options']


def test_dimension_single_filter_passed_on_to_query(mock_cube):
    ajax(mock_cube, 'dimension_values', {
        'dimension': 'ref-area',
        'time-period': '2002',
        'rev': '123',
    })
    cube_call = mock_cube.get_dimension_options.mock_calls[0]
    assert cube_call == call('ref-area', [('time-period', '2002')])


def test_dimension_labels_passed_on_to_query(mock_cube):
    mock_cube.get_dimension_labels.return_value = [
        {'label': 'indicator one', 'short_label': 'ind one'},
    ]
    ajax(mock_cube, 'dimension_labels', {
        'dimension': 'unit-measure',
        'value': 'pc_ind',
        'rev': '123',
    })
    cube_call = mock_cube.get_dimension_labels.mock_calls[0]
    assert cube_call == call('unit-measure', 'pc_ind')


def test_dimension_filters_passed_on_to_query(mock_cube):
    ajax(mock_cube, 'dimension_values', {
        'dimension': 'ref-area',
        'time-period': '2002',
        'indicator': 'h_iacc',
        'rev': '123',
    })
    cube_call = mock_cube.get_dimension_options.mock_calls[0]
    assert cube_call == call('ref-area', [('indicator', 'h_iacc'),
                                          ('time-period', '2002')])


def test_dimension_xy_filters_passed_on_to_query(mock_cube):
    mock_cube.get_dimension_options_xy.return_value = ['something']
    res = ajax(mock_cube, 'dimension_values_xy', {
        'dimension': 'ref-area',
        'time-period': '2002',
        'breakdown': 'blahblah',
        'x-indicator': 'i_iuse',
        'y-indicator': 'i_iu3g',
        'rev': '123',
    })
    assert mock_cube.get_dimension_options_xy.mock_calls[0] == call(
        'ref-area',
        [('breakdown', 'blahblah'), ('time-period', '2002')],
        [('indicator', 'i_iuse')],
        [('indicator', 'i_iu3g')])
    assert res == {'options': ['something']}


def test_data_query_sends_filters_and_columns(mock_cube):
    ajax(mock_cube, 'datapoints', {
        'fields': 'time-period,ref-area,value',
        'indicator': 'i_bfeu',
        'breakdown': 'IND_TOTAL',
        'unit-measure': 'pc_ind',
        'rev': '123',
    })
    cube_call = mock_cube.get_data.mock_calls[0]
    assert cube_call == call(fields=['time-period', 'ref-area', 'value'],
                             filters=[('breakdown', 'IND_TOTAL'),
                                      ('indicator', 'i_bfeu'),
                                      ('unit-measure', 'pc_ind')])


def test_data_query_returns_rows(mock_cube):
    rows = [{'time-period': '2011', 'ref-area': 'IE', 'value': 0.2222},
            {'time-period': '2010', 'ref-area': 'PT', 'value': 0.0609}]
    mock_cube.get_data.return_value = iter(rows)
    res = ajax(mock_cube, 'datapoints', {
        'fields': 'time-period,ref-area,value',
        'indicator': 'i_bfeu',
        'breakdown': 'IND_TOTAL',
        'unit-measure': 'pc_ind',
    })
    cube_call = mock_cube.get_data.mock_calls[0]
    assert cube_call == call(fields=['time-period', 'ref-area', 'value'],
                             filters=[('breakdown', 'IND_TOTAL'),
                                      ('indicator', 'i_bfeu'),
                                      ('unit-measure', 'pc_ind')])
    assert res == {'datapoints': rows}


def test_data_xy_query_sends_filters_and_columns(mock_cube):
    mock_cube.get_data_xy.return_value = ['something']
    res = ajax(mock_cube, 'datapoints_xy', {
        'x-indicator': 'i_iuse',
        'y-indicator': 'i_iu3g',
        'unit-measure': 'pc_ind',
        'breakdown': 'IND_TOTAL',
        'columns': 'time-period,ref-area',
        'xy_columns': 'value',
        'rev': '123',
    })
    cube_call = mock_cube.get_data_xy.mock_calls[0]
    assert cube_call == call(columns=['time-period', 'ref-area'],
                             xy_columns=['value'],
                             filters=[('breakdown', 'IND_TOTAL'),
                                      ('unit-measure', 'pc_ind')],
                             x_filters=[('indicator', 'i_iuse')],
                             y_filters=[('indicator', 'i_iu3g')])
    assert res == {'datapoints': ['something']}
