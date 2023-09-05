module.exports = function (app) {

    var Internal = {}
    var Query = {};

    Query.defaultParams = {}

    Internal.getRegionFilter = function (type, key) {

        var regionsFilter;

        if (type == 'country' || (type == 'city')) {
            regionsFilter = "1=1";
        } else {
            var regionsFilter = "";
            if (type == 'city')
                regionsFilter += "cd_geocmu = '" + key + "'"
            else if (type == 'state')
                regionsFilter += "uf = '" + key + "'"
            else if (type == 'biome')
                regionsFilter += "bioma = '" + key.toUpperCase() + "'"
            else if (type == 'fronteira') {
                if (key == 'amz_legal') {
                    regionsFilter += "amaz_legal = 1"
                }
                else if (key.toLowerCase() == 'MATOPIBA'.toLowerCase()) {
                    regionsFilter += "matopiba = 1"
                }
                else if (key.toLowerCase() == 'ARCODESMAT'.toLowerCase()) {
                    regionsFilter += "arcodesmat = 1"
                }
            }
        }

        return regionsFilter
    }

    Internal.getYearFilter = function (year) {

        if (year) {
            year = "year = " + (year)
        }
        return year;
    }

    Query.resumo = function (params) {
        var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);
        return [
            {
                source: 'lapig',
                id: 'region',
                sql: "SELECT CAST(SUM(pol_ha) as double precision) as area_region FROM new_regions WHERE " + regionFilter + ""
            },
            {
                source: 'agrotoxicos',
                id: 'agrotoxicos_10',
                sql: " SELECT  CAST(sum(a.kg_ha_10) as double precision) as value"
                    + " FROM pa_br_agrotoxicos a "
                    + " WHERE " + regionFilter,
                mantain: true
            },
            {
                source: 'agrotoxicos',
                id: 'agrotoxicos_19',
                sql: " SELECT  CAST(sum(a.kg_ha_19) as double precision) as value"
                    + " FROM pa_br_agrotoxicos a "
                    + " WHERE " + regionFilter,
                mantain: true
            }
        ]
    }

    Query.area1 = function (params) {

        var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);
        return [
            {
                source: 'agrotoxicos',
                id: 'produtos_agrotoxicos',
               sql:   "select sum(glifo_2010) as glifosato__2010," +
                    " sum(glifo_2019) as glifosato__2019," +
                    " sum(atraz_2010) as atrazina__2010," +
                     " sum(atraz_2019) as atrazina__2019, " + 
                     " sum(acefa_2010) as acefato__2010," +
                     " sum(acefa_2019) as acefato__2019, " +
                     "sum(manco_2010) as mancozebe__2010," +
                     " sum(manco_2019) as mancozebe__2019, " +
                     ' sum("2_4d_2010") as "24_d__2010",' +
                     ' sum("2_4d_2019") as "24_d__2019"' +
                    " from pa_br_ingredientes_ativos_uf WHERE " + regionFilter,
                mantain: true
            }

        ];

    }

    Query.area2 = function (params) {

        var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);
        // var yearFilter = params['year'] ? Internal.getYearFilter(params['year']) : Internal.getYearFilter(2020);

        return [
            {
                source: 'agrotoxicos',
                id: 'produtos_agrotoxicos',
               sql:   "select sum(glifo_2010) as glifosato_2010," +
                    " sum(glifo_2019) as glifosato_2019," +
                    " sum(atraz_2010) as atrazina_2010," +
                     " sum(atraz_2019) as atrazina_2019, " + 
                     " sum(acefa_2010) as acefato_2010," +
                     " sum(acefa_2019) as acefato_2019, " +
                     "sum(manco_2010) as mancozebe_2010," +
                     " sum(manco_2019) as mancozebe_2019, " +
                     ' sum("2_4d_2010") as "24_d_2010",' +
                     ' sum("2_4d_2019") as "24_d_2019"' +
                    " from pa_br_produtos_agrotoxicos WHERE " + regionFilter,
                mantain: true
            }

        ];
    }

    Query.area3 = function (params) {

        var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);
        var yearFilter = params['year'] ? Internal.getYearFilter(params['year']) : Internal.getYearFilter(2020);
        // var amount = params['amount'] ? params['amount'] : 10
        return [
            {
                source: 'lapig',
                id: 'estados',
                sql: " SELECT UPPER(uf) AS label, '#d4a31c' as color,  SUM(area_ha) as value  FROM pasture_col6 "
                    + "WHERE " + regionFilter
                    + " AND " + yearFilter
                    + " GROUP BY 1, 2 ORDER BY 3 DESC;",
                // + " LIMIT " + Number(amount) + ";",
                mantain: true
            }
        ]
    }

    Query.areatable = function (params) {
        var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);
        // var yearFilter = params['year'] ? Internal.getYearFilter(params['year']) : Internal.getYearFilter(2020);

        return [
            {
                source: 'agrotoxicos',
                id: 'intoxicacao',
                sql: "SELECT p.nm_mun as city, UPPER(p.sigla_uf) as uf, (p.acumulado_intoxicacao) as value FROM pa_br_intoxicacao_municipios p "
                    + " WHERE " + regionFilter
                    + "ORDER BY 3 DESC;",
                    // + " AND " + yearFilter
                    // + " GROUP BY 1, 2 ORDER BY 3 DESC;",
                // + " LIMIT " + Number(amount) + ";",
                mantain: true
            },
            {
                source: 'agrotoxicos',
                id: 'mortes_intoxicacao',
                sql: " SELECT p.nome as city, UPPER(p.uf) as uf, (p.soma_obito) as value  FROM pa_br_intoxicacao_mortes_municipios p "
                    + "WHERE " + regionFilter
                    + "ORDER BY 3 DESC;",
                    // + " AND " + yearFilter
                    // + " GROUP BY 1  ORDER BY 2 DESC;",
                // + " LIMIT " + Number(amount) + ";",
                mantain: true
            }
            // {
            //     source: 'lapig',
            //     id: 'biomas',
            //     sql: " SELECT p.bioma AS biome,  SUM(p.st_area_ha) as value  FROM pasture_col6 p "
            //         + "WHERE " + regionFilter
            //         + " AND " + yearFilter
            //         + " GROUP BY 1 ORDER BY 2 DESC;",
            //     // + " LIMIT " + Number(amount) + ";",
            //     mantain: true
            // }
        ]
    }


    return Query;

}