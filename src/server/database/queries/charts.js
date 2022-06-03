module.exports = function (app) {

    var Internal = {}
    var Query = {};

    Query.defaultParams = {}

    Internal.getRegionFilter = function (type, key) {

        var regionsFilter;

        if (type == 'country') {
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
        var yearFilter = params['year'] ? Internal.getYearFilter(params['year']) : Internal.getYearFilter(2020);
        return [
            {
                source: 'lapig',
                id: 'region',
                sql: "SELECT CAST(SUM(pol_ha) as double precision) as area_region FROM new_regions WHERE " + regionFilter + ""
            },
            {
                source: 'lapig',
                id: 'pasture',
                sql: " SELECT  CAST(sum(a.st_area_ha) as double precision) as value "
                    + " FROM pasture_col6 a "
                    + " WHERE " + regionFilter
                    + " AND " + yearFilter,
                mantain: true
            },
            {
                source: 'lapig',
                id: 'pasture_quality',
                sql: " SELECT b.name as classe, b.color, CAST(sum(a.area_ha) as double precision) as value "
                    + " FROM pasture_quality_col6 a " + "INNER JOIN graphic_colors as b on cast(a.classe as varchar) = b.class_number AND b.table_rel = 'pasture_quality'"
                    + " WHERE " + regionFilter
                    + " AND " + yearFilter
                    + " GROUP BY 1,2;",
                mantain: true
            },
        ]
    }

    Query.area1 = function (params) {

        var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);
        // var yearFilter = Internal.getYearFilter(params['year']);

        return [
            //     {
            //     source: 'lapig',
            //     id: 'prodes',
            //     // sql: " SELECT a.year as label, b.color, CAST(SUM(pol_ha) / 1000 as double precision) as value, (SELECT CAST(SUM(pol_ha) / 1000 as double precision) FROM regions " + regionFilter + ") as area_mun " +
            //     //     " FROM desmatamento_prodes a " +
            //     //     "INNER JOIN graphic_colors as B on 'prodes_cerrado' = b.name AND b.table_rel = 'desmatamento_prodes' " + regionFilter +
            //     //     // " AND " + yearFilter +
            //     //     " GROUP BY 1,2;",
            //     sql: " SELECT year as label, 'prodes_cerrado' source, CAST(SUM(pol_ha) / 1000 as double precision) as value, (SELECT CAST(SUM(pol_ha) / 1000 as double precision) FROM regions " + regionFilter + ") as area_mun " +
            //         " FROM desmatamento_prodes " +
            //         regionFilter +
            //         // " AND " + yearFilter +
            //         " GROUP BY 1;",
            //     mantain: true
            // },
            {
                source: 'lapig',
                id: 'pasture',
                sql: " SELECT  a.year as label, b.color, b.name as classe, sum(a.st_area_ha) as value, "
                    + "(SELECT CAST(SUM(pol_ha) as double precision) FROM new_regions WHERE " + regionFilter + ") as area_mun "
                    + " FROM pasture_col6 a " + "INNER JOIN graphic_colors b on b.table_rel = 'pasture' "
                    + " WHERE " + regionFilter
                    // " AND " + yearFilter +
                    + " GROUP BY 1,2,3 ORDER BY 1 ASC;",
                mantain: true
            },
            {
                source: 'lapig',
                id: 'lotacao_bovina_regions',
                sql: " SELECT  a.year as label, b.color, b.name as classe, sum(a.ua) as value,  (SELECT CAST(SUM(pol_ha) as double precision) FROM regions WHERE " + regionFilter + ") as area_mun " +
                    " FROM lotacao_bovina_regions a " + "INNER JOIN graphic_colors as b on b.table_rel = 'rebanho_bovino' " +
                    "WHERE " + regionFilter +
                    // " AND " + yearFilter +
                    " GROUP BY 1,2,3 ORDER BY 1 ASC;",
                mantain: true
            },
            {
                source: 'lapig',
                id: 'pasture_quality',
                sql: " SELECT a.year as label,b.color, b.name as classe, sum(a.area_ha) as value, (SELECT CAST(SUM(pol_ha) / 1000 as double precision) FROM regions WHERE " + regionFilter + ") as area_mun " +
                    " FROM pasture_quality_col6 a " + "INNER JOIN graphic_colors as b on cast(a.classe as varchar) = b.class_number AND b.table_rel = 'pasture_quality'" +
                    "WHERE " + regionFilter +
                    // " AND " + yearFilter +
                    " GROUP BY 1,2,3 ORDER BY 1 ASC;",
                mantain: true
            },
        ]

    }

    Query.area2 = function (params) {

        var regionFilter = Internal.getRegionFilter(params['typeRegion'], params['valueRegion']);
        var yearFilter = params['year'] ? Internal.getYearFilter(params['year']) : Internal.getYearFilter(2020);

        console.log("select sum(glifo_2010) as glifosato_2010," +
        " sum(glifo_2019) as glifosato_2019," +
        " sum(atraz_2010) as atrazina_2010," +
         " sum(atraz_2019) as atrazina_2019, " + 
         "sum(acefa_2010) as acefato_2010," +
         " sum(acefa_2019) as acefato_2019, " +
         "sum(manco_2010) as mancozebe_2010," +
         " sum(manco_2019) as mancozebe_2019, " +
         ' sum("2_4d_2010") as "24_d_2010",' +
         ' sum("2_4d_2019") as "24_d_2019"' +
        " from pa_br_produtos_agrotoxicos WHERE " + regionFilter)
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
        var yearFilter = params['year'] ? Internal.getYearFilter(params['year']) : Internal.getYearFilter(2020);

        return [
            {
                source: 'lapig',
                id: 'municipios',
                sql: "SELECT p.municipio as city, UPPER(p.uf) as uf, SUM(p.st_area_ha) as value FROM pasture_col6 p "
                    + " WHERE " + regionFilter
                    + " AND " + yearFilter
                    + " GROUP BY 1, 2 ORDER BY 3 DESC;",
                // + " LIMIT " + Number(amount) + ";",
                mantain: true
            },
            {
                source: 'lapig',
                id: 'estados',
                sql: " SELECT UPPER(p.uf) AS uf, SUM(p.st_area_ha) as value  FROM pasture_col6 p "
                    + "WHERE " + regionFilter
                    + " AND " + yearFilter
                    + " GROUP BY 1  ORDER BY 2 DESC;",
                // + " LIMIT " + Number(amount) + ";",
                mantain: true
            },
            {
                source: 'lapig',
                id: 'biomas',
                sql: " SELECT p.bioma AS biome,  SUM(p.st_area_ha) as value  FROM pasture_col6 p "
                    + "WHERE " + regionFilter
                    + " AND " + yearFilter
                    + " GROUP BY 1 ORDER BY 2 DESC;",
                // + " LIMIT " + Number(amount) + ";",
                mantain: true
            }
        ]
    }


    return Query;

}