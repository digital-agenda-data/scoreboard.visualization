"""Common configuration constants
"""
PROJECTNAME = 'scoreboard.visualization'

ADD_PERMISSIONS = {
    'ScoreboardVisualization':
        'scoreboard.visualization: Add ScoreboardVisualization',
}

from zope.i18nmessageid.message import MessageFactory
_ = MessageFactory('scoreboard')

# This list is used for initializing new visualizations
DEFAULTS = {
    "facets": [
        {
          "constraints": {},
          "dimension": "indicator-group",
          "label": "Indicator group",
          "name": "indicator-group",
          "type": "select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group"
          },
          "dimension": "indicator",
          "label": "Indicator",
          "sortBy": "inner_order",
          "sortOrder": "asc",
          "name": "indicator",
          "type": "select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator"
          },
          "name": "breakdown-group",
          "dimension": "breakdown-group",
          "label": "Breakdown group",
          "sortOrder": "asc",
          "type": "select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator",
            "breakdown-group": "breakdown-group"
          },
          "dimension": "breakdown",
          "label": "Breakdown",
          "name": "breakdown",
          "sortBy": "inner_order",
          "sortOrder": "asc",
          "type": "select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator",
            "breakdown-group": "breakdown-group",
            "breakdown": "breakdown"
          },
          "dimension": "unit-measure",
          "label": "Unit of measure",
          "name": "unit-measure",
          "type": "select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator",
            "breakdown-group": "breakdown-group",
            "breakdown": "breakdown",
            "unit-measure": "unit-measure"
          },
          "dimension": "ref-area",
          "label": "Select the countries",
          "name": "ref-area",
          "type": "multiple_select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator",
            "breakdown-group": "breakdown-group",
            "breakdown": "breakdown",
            "unit-measure": "unit-measure"
          },
          "dimension": "time-period",
          "label": "Period",
          "name": "time-period",
          "type": "select"
        },
        {
          "name": "value",
          "type": "all-values",
          "dimension": "value"
        }
    ],
    "titles":
        {
          "title":
            [
                { "facet_name": "indicator",
                  "prefix": None,
                  "suffix": None,
                  "format": "label" }
            ],

          "subtitle": [ ],

          "yAxisTitle":
            [
                { "facet_name": "unit-measure",
                  "prefix": None,
                  "suffix": None,
                  "format": "short_label" }
            ]
        },

    "sort": {
        "by": 'category',
        "order": 1,
        "each_series": False
    }
}

# This list is used by country_profile chart and can be customized within
# ZMI > portal_properties > scoreboard_properties
EU = {
    "BE": "Belgium",
    "BG": "Bulgaria",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "DE": "Germany",
    "EE": "Estonia",
    "IE": "Ireland",
    "EL": "Greece",
    "ES": "Spain",
    "FR": "France",
    "IT": "Italy",
    "CY": "Cyprus",
    "LV": "Latvia",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "HU": "Hungary",
    "MT": "Malta",
    "NL": "Netherlands",
    "AT": "Austria",
    "PL": "Poland",
    "PT": "Portugal",
    "RO": "Romania",
    "SI": "Slovenia",
    "SK": "Slovakia",
    "FI": "Finland",
    "SE": "Sweden",
    "UK": "United Kingdom",
    "HR": "Croatia"
}

# This list is used by country_profile chart and can be customized within
# ZMI > portal_properties > scoreboard_properties
WHITELIST = [
    {'indicator-group': 'back', 'indicator': 'i_ilt12', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'back', 'indicator': 'i_iu3', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'bbquality', 'indicator': 'Price_Internet_Fixed_Tel', 'breakdown': 'offer_8_12_Mbps', 'unit-measure': 'median_euro_PPP'},
    {'indicator-group': 'bbquality', 'indicator': 'Price_Internet_Fixed_Tel_TV', 'breakdown': 'offer_8_12_Mbps', 'unit-measure': 'median_euro_PPP'},
    {'indicator-group': 'bbquality', 'indicator': 'Price_Internet_only', 'breakdown': 'offer_8_12_Mbps', 'unit-measure': 'median_euro_PPP'},
    {'indicator-group': 'bbquality', 'indicator': 'actspeed', 'breakdown': 'FTTX', 'unit-measure': 'pc_nomspeed'},
    {'indicator-group': 'bbquality', 'indicator': 'actspeed', 'breakdown': 'cable', 'unit-measure': 'pc_nomspeed'},
    {'indicator-group': 'bbquality', 'indicator': 'actspeed', 'breakdown': 'xDSL', 'unit-measure': 'pc_nomspeed'},
    {'indicator-group': 'bbquality', 'indicator': 'bb_speed10', 'breakdown': 'TOTAL_FBB', 'unit-measure': 'pc_lines'},
    {'indicator-group': 'bbquality', 'indicator': 'bb_speed100', 'breakdown': 'TOTAL_FBB', 'unit-measure': 'pc_lines'},
    {'indicator-group': 'bbquality', 'indicator': 'bb_speed2', 'breakdown': 'TOTAL_FBB', 'unit-measure': 'pc_lines'},
    {'indicator-group': 'bbquality', 'indicator': 'bb_speed30', 'breakdown': 'TOTAL_FBB', 'unit-measure': 'pc_lines'},
    {'indicator-group': 'bbquality', 'indicator': 'mob_roam', 'breakdown': 'total', 'unit-measure': 'eurocent'},
    {'indicator-group': 'broadband', 'indicator': 'bb_dsl', 'breakdown': 'TOTAL_FBB', 'unit-measure': 'pc_lines'},
    {'indicator-group': 'broadband', 'indicator': 'bb_fcov', 'breakdown': 'rural_pop', 'unit-measure': 'pc_rural_pop'},
    {'indicator-group': 'broadband', 'indicator': 'bb_fcov', 'breakdown': 'total_pop', 'unit-measure': 'pc_pop'},
    {'indicator-group': 'broadband', 'indicator': 'bb_ne', 'breakdown': 'TOTAL_FBB', 'unit-measure': 'pc_lines'},
    {'indicator-group': 'broadband', 'indicator': 'bb_ngacov', 'breakdown': 'TOTAL_POPHH', 'unit-measure': 'pc_hh_all'},
    {'indicator-group': 'broadband', 'indicator': 'bb_penet', 'breakdown': 'TOTAL_FBB', 'unit-measure': 'subs_per_100_pop'},
    {'indicator-group': 'broadband', 'indicator': 'bb_scov', 'breakdown': 'TOTAL_POPHH', 'unit-measure': 'pc_hh_all'},
    {'indicator-group': 'broadband', 'indicator': 'e_broad', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'broadband', 'indicator': 'h_broad', 'breakdown': 'hh_total', 'unit-measure': 'pc_hh'},
    {'indicator-group': 'broadband', 'indicator': 'tel_inv', 'breakdown': 'TOTAL_TEL', 'unit-measure': 'pc_tel_rev'},
    {'indicator-group': 'ebusiness', 'indicator': 'E_ERP1', 'breakdown': 'ent_l_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'E_ERP1', 'breakdown': 'ent_sm_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'E_WEB', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'P_EMPMD', 'breakdown': 'ent_all_xfin', 'unit-measure': 'PC_EMP'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_ade', 'breakdown': 'ent_l_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_ade', 'breakdown': 'ent_sm_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_crman', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_empmd_gt20', 'breakdown': 'ent_l_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_empmd_gt20', 'breakdown': 'ent_sm_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_inv', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_ra', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_rfid', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_sisc', 'breakdown': 'ent_l_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_sisc', 'breakdown': 'ent_sm_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_sisorp', 'breakdown': 'ent_l_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ebusiness', 'indicator': 'e_sisorp', 'breakdown': 'ent_sm_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ecommerce', 'indicator': 'e_ebuy', 'breakdown': 'ent_l_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ecommerce', 'indicator': 'e_ebuy', 'breakdown': 'ent_sm_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ecommerce', 'indicator': 'e_esell', 'breakdown': 'ent_l_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ecommerce', 'indicator': 'e_esell', 'breakdown': 'ent_sm_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ecommerce', 'indicator': 'e_eturn', 'breakdown': 'ent_l_xfin', 'unit-measure': 'pc_turn'},
    {'indicator-group': 'ecommerce', 'indicator': 'e_eturn', 'breakdown': 'ent_sm_xfin', 'unit-measure': 'pc_turn'},
    {'indicator-group': 'ecommerce', 'indicator': 'i_bfeu', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ecommerce', 'indicator': 'i_bfeu', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_ilt12'},
    {'indicator-group': 'ecommerce', 'indicator': 'i_bgoodo', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_ilt12'},
    {'indicator-group': 'ecommerce', 'indicator': 'i_blt12', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ecommerce', 'indicator': 'i_blt12', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_ilt12'},
    {'indicator-group': 'ecommerce', 'indicator': 'i_iusell', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'egovernment', 'indicator': 'FOA_cit', 'breakdown': 'total', 'unit-measure': 'pc_pub_serv_for_citizen'},
    {'indicator-group': 'egovernment', 'indicator': 'FOA_ent', 'breakdown': 'total', 'unit-measure': 'pc_pub_serv_for_ent'},
    {'indicator-group': 'egovernment', 'indicator': 'e_igov', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'egovernment', 'indicator': 'e_igov2pr', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'egovernment', 'indicator': 'e_igovrt', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'egovernment', 'indicator': 'i_igov12rt', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'egovernment', 'indicator': 'i_iugov12', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ehealth', 'indicator': 'I_IUMAPP', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'ehealth', 'indicator': 'i_ihif', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'ict-edu', 'indicator': 'eun_computers', 'breakdown': 'grade11gen', 'unit-measure': 'nb_x100stud'},
    {'indicator-group': 'ict-edu', 'indicator': 'eun_computers', 'breakdown': 'grade11voc', 'unit-measure': 'nb_x100stud'},
    {'indicator-group': 'ict-edu', 'indicator': 'eun_computers', 'breakdown': 'grade4', 'unit-measure': 'nb_x100stud'},
    {'indicator-group': 'ict-edu', 'indicator': 'eun_computers', 'breakdown': 'grade8', 'unit-measure': 'nb_x100stud'},
    {'indicator-group': 'ict-edu', 'indicator': 'eun_web', 'breakdown': 'grade11gen', 'unit-measure': 'pc_schools'},
    {'indicator-group': 'ict-edu', 'indicator': 'eun_web', 'breakdown': 'grade11voc', 'unit-measure': 'pc_schools'},
    {'indicator-group': 'ict-edu', 'indicator': 'eun_web', 'breakdown': 'grade4', 'unit-measure': 'pc_schools'},
    {'indicator-group': 'ict-edu', 'indicator': 'eun_web', 'breakdown': 'grade8', 'unit-measure': 'pc_schools'},
    {'indicator-group': 'ict-sector', 'indicator': 'ict_exp', 'breakdown': 'goods', 'unit-measure': 'pc_exp'},
    {'indicator-group': 'ict-sector', 'indicator': 'ict_exp', 'breakdown': 'services', 'unit-measure': 'pc_exp'},
    {'indicator-group': 'ict-sector', 'indicator': 'ict_imp', 'breakdown': 'goods', 'unit-measure': 'pc_imp'},
    {'indicator-group': 'ict-sector', 'indicator': 'ict_imp', 'breakdown': 'services', 'unit-measure': 'pc_imp'},
    {'indicator-group': 'ict-skills', 'indicator': 'E_ITSP2', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ict-skills', 'indicator': 'E_ITSPVAC2', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'ict-skills', 'indicator': 'P_IUSE', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_emp'},
    {'indicator-group': 'ict-skills', 'indicator': 'i_cisk_sfjob', 'breakdown': 'sal_self_fam', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ict-skills', 'indicator': 'i_cisk_sfjobx', 'breakdown': 'sal_self_fam', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ict-skills', 'indicator': 'i_cprg', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ict-skills', 'indicator': 'i_csk_ge_me', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ict-skills', 'indicator': 'i_cweb', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ict-skills', 'indicator': 'i_isk_ge_me', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ict-skills', 'indicator': 'i_skedu', 'breakdown': 'y16_24', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ict-skills', 'indicator': 'i_skedu', 'breakdown': 'y25_54', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'ict-skills', 'indicator': 'ict_specialists', 'breakdown': 'total', 'unit-measure': 'pc_ind_emp'},
    {'indicator-group': 'internet-services', 'indicator': 'I_IUPH1', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_igovrt', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iubk', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iueduif', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iugm', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iugov', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iuif', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iujob', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iunw', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iuolc', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iusnet', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iuupl', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-services', 'indicator': 'i_iuvote', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind_iu3'},
    {'indicator-group': 'internet-usage', 'indicator': 'AAAA_cov', 'breakdown': '1M_websites', 'unit-measure': 'pc_websites'},
    {'indicator-group': 'internet-usage', 'indicator': 'h_iacc', 'breakdown': 'hh_total', 'unit-measure': 'pc_hh'},
    {'indicator-group': 'internet-usage', 'indicator': 'i_ia12ave', 'breakdown': 'y16_24', 'unit-measure': 'ia12ave'},
    {'indicator-group': 'internet-usage', 'indicator': 'i_ia12ave', 'breakdown': 'y25_54', 'unit-measure': 'ia12ave'},
    {'indicator-group': 'internet-usage', 'indicator': 'i_ia12ave', 'breakdown': 'y55_74', 'unit-measure': 'ia12ave'},
    {'indicator-group': 'internet-usage', 'indicator': 'i_iday', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'internet-usage', 'indicator': 'i_iumc', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'internet-usage', 'indicator': 'i_iuse', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'internet-usage', 'indicator': 'i_iuse', 'breakdown': 'rf_ge1', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'internet-usage', 'indicator': 'i_iux', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'mobile', 'indicator': 'e_pmd', 'breakdown': 'ent_all_xfin', 'unit-measure': 'pc_ent'},
    {'indicator-group': 'mobile', 'indicator': 'i_iu3g', 'breakdown': 'ind_total', 'unit-measure': 'pc_ind'},
    {'indicator-group': 'mobile', 'indicator': 'mbb_3gcov', 'breakdown': 'total_pop', 'unit-measure': 'pc_pop'},
    {'indicator-group': 'mobile', 'indicator': 'mbb_hspacov', 'breakdown': 'TOTAL_POPHH', 'unit-measure': 'pc_hh_all'},
    {'indicator-group': 'mobile', 'indicator': 'mbb_penet', 'breakdown': 'TOTAL_MBB', 'unit-measure': 'subs_per_100_pop'},
    {'indicator-group': 'mobile', 'indicator': 'mob_arpm', 'breakdown': 'TOTAL_MOB', 'unit-measure': 'eurocent'},
    {'indicator-group': 'mobile', 'indicator': 'mob_arpu', 'breakdown': 'TOTAL_MOB', 'unit-measure': 'euro'},
    {'indicator-group': 'mobile', 'indicator': 'mob_ms', 'breakdown': 'total_mob', 'unit-measure': 'pc_subs'},
    {'indicator-group': 'mobile', 'indicator': 'mob_penet', 'breakdown': 'TOTAL_MOB', 'unit-measure': 'subs_per_100_pop'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_EC_funding', 'breakdown': 'orgclass_hesrec', 'unit-measure': 'pc_FP7ICT_EC_funding'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_EC_funding', 'breakdown': 'orgclass_le', 'unit-measure': 'pc_FP7ICT_EC_funding'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_EC_funding', 'breakdown': 'orgclass_nil', 'unit-measure': 'pc_FP7ICT_EC_funding'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_EC_funding', 'breakdown': 'orgclass_sme', 'unit-measure': 'pc_FP7ICT_EC_funding'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_EC_funding', 'breakdown': 'orgclass_total', 'unit-measure': 'euro_x_hab'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_EC_funding', 'breakdown': 'orgclass_total', 'unit-measure': 'euro_x_million_of_GDP'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_afxp', 'breakdown': 'orgclass_sme', 'unit-measure': 'euro'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_afxp', 'breakdown': 'orgclass_total', 'unit-measure': 'euro'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_cofin', 'breakdown': 'orgclass_sme', 'unit-measure': 'pc_total_cost'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_cofin', 'breakdown': 'orgclass_total', 'unit-measure': 'pc_total_cost'},
    {'indicator-group': 'research-and-development', 'indicator': 'FP7ICT_newENTRY', 'breakdown': 'orgclass_total', 'unit-measure': 'pc_organisations'},
    {'indicator-group': 'research-and-development', 'indicator': 'gbaord_ict', 'breakdown': 'total', 'unit-measure': 'pc_gbaord'}
]
