const UtilsLang = require('../utils/language');


module.exports = function (app) {
    var Controller = {}
    var Internal = {}


    Internal.numberFormat = function (numero) {
        numero = numero.toFixed(2).split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    Internal.replacementStrings = function (template, replacements) {
        return template.replace(/#([^#]+)#/g, (match, key) => {
            // If there's a replacement for the key, return that replacement with a `<br />`. Otherwise, return a empty string.
            return replacements[key] !== undefined
                ? replacements[key]
                : "";
        });
    }

    Internal.buildGraphResult = function (allQueriesResult, chartDescription) {
        var dataInfo = {}

        try {
            let arrayLabels = []
            let arrayData = []
            for (let query of chartDescription.idsOfQueriesExecuted) {

                let queryInd = allQueriesResult[query.idOfQuery]

                arrayLabels.push(...queryInd.map(a => String(a.label)))
                let colors = [...new Set(queryInd.map(a => a.color))]

                if (chartDescription.type == 'line') {

                    if (typeof query.labelOfQuery === 'string') {
                        arrayData.push({
                            label: query.labelOfQuery,
                            data: [...queryInd.map(a => parseFloat(a.value))],
                            fill: false,
                            borderColor: [...new Set(queryInd.map(a => a.color))],
                            tension: .4
                        })
                    }
                    else {
                        for (const [keyLabelQuery, valueLabelQuery] of Object.entries(query.labelOfQuery)) {
                            arrayData.push({
                                label: valueLabelQuery,
                                data: [...queryInd.filter(a => a.classe == keyLabelQuery).map(ob => parseFloat(ob.value))],
                                fill: false,
                                borderColor: [...new Set(queryInd.filter(a => a.classe == keyLabelQuery).map(ob => ob.color))],
                                tension: .4
                            })
                        }
                    }
                }
                else if (chartDescription.type == 'pie' || chartDescription.type == 'doughnut') {
                    if (typeof query.labelOfQuery === 'string') {
                        arrayData.push({
                            label: query.labelOfQuery,
                            data: [...queryInd.map(a => parseFloat(a.value))],
                            backgroundColor: [...new Set(queryInd.map(element => element.color))],
                            hoverBackgroundColor: [...new Set(queryInd.map(element => element.color))],
                        })
                    }
                    else {
                        arrayData.push({
                            label: query.idOfQuery,
                            data: [...queryInd.map(a => parseFloat(a.value))],
                            backgroundColor: [...new Set(queryInd.map(element => element.color))],
                            hoverBackgroundColor: [...new Set(queryInd.map(element => element.color))],
                        })
                    }

                }
                else if (chartDescription.type == 'bar' || chartDescription.type == 'horizontalBar') {
                    if (typeof query.labelOfQuery === 'string') {
                        arrayData.push({
                            label: query.labelOfQuery,
                            data: [...queryInd.map(a => parseFloat(a.value))],
                            backgroundColor: [...new Set(queryInd.map(a => a.color))],
                        })
                    }
                    else {
                        for (const [keyLabelQuery, valueLabelQuery] of Object.entries(query.labelOfQuery)) {
                            arrayData.push({
                                label: valueLabelQuery,
                                data: [...queryInd.filter(a => a.classe == keyLabelQuery).map(ob => parseFloat(ob.value))],
                                backgroundColor: [...new Set(queryInd.filter(a => a.classe == keyLabelQuery).map(ob => ob.color))],
                            })
                        }
                    }
                }
            }

            dataInfo = {
                labels: [...new Set(arrayLabels)],
                datasets: [...arrayData]
            }

            // chart['indicators'] = queryInd.filter(val => {
            //     return parseFloat(val.value) > 10
            // })
        }
        catch (e) {
            dataInfo = null
        }

        return dataInfo;
    }

    Internal.buildAgrotoxicosTimeseries = function(data, labelsOfQuery){

        let dataset = [];

        data.forEach(d => {

            Object.keys(d).forEach(key => {
                // console.log(key) // returns the keys in an object
                // console.log(d[key])  // returns the appropriate value 
    
                if(key != 'year'){
                    dataset.push({
                        label: labelsOfQuery.labelOfQuery[key],
                        value: d[key],
                        color: (key.toLowerCase() == 'glifosato' ? '#8f8321' : (key.toLowerCase() == 'atrazina' ? 'blue' :
                        (key.toLowerCase() == 'acefato' ? 'red' : (key.toLowerCase() == 'mancozebe' ? 'green' : '#4e3830'))))
                    })
                }
             })
        })

        const groupedTech = dataset.reduce((acc, value) => {
            // Group initialization
            if (!acc[value.label]) {
              acc[value.label] = []
            }
            // Grouping
            acc[value.label].push(value)
            return acc
          }, {})
          
          const res = Object.entries(groupedTech).map(([label, options]) => ({
            label,
            options
          }))

        // console.log("AA - ",dataset)
        let dataInfo = {
            labels: data.map(d => d.year),
            datasets: res.map(d => {

                let obj = {
                    label: d.label,
                    data: [...d.options.map(a => a.value)],
                    fill: false,
                    borderColor: [...new Set(d.options.map(a => a.color))],
                    tension: .4
                }
                return obj
            })
        }

        return dataInfo;
    }

    Internal.buildTableData = function (allQueriesResult, chartDescription) {

        let dataInfo = []
        try {

            for (let query of chartDescription.idsOfQueriesExecuted) {

                let queryInd = allQueriesResult[query.idOfQuery]
                let index = 1;
                for (let i = 0; i < queryInd.length; i++) {
                    queryInd[i].index = index++ + 'º'
                    queryInd[i].value = parseInt(queryInd[i].value)
                }

                dataInfo = [...queryInd]
            }

        }
        catch (e) {
            dataInfo = null
        }

        return dataInfo;

    };

    Controller.handleResumo = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion, year } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
            yearTranslate: year
        };

        let result = {
            region: {
                area: request.queryResult['region'][0].area_region,
            },
            first: {
                area: request.queryResult['agrotoxicos_10'][0].value,
                percentOfRegionArea: Internal.numberFormat((request.queryResult['agrotoxicos_10'][0].value / request.queryResult['region'][0].area_region) * 100) + "%"
            },
            second: {
                area: request.queryResult['agrotoxicos_19'][0].value,
                percentOfRegionArea: Internal.numberFormat((request.queryResult['agrotoxicos_19'][0].value / request.queryResult['region'][0].area_region) * 100) + "%"
            }
        }

        response.send(result)
        response.end();

    };

    Controller.handleArea1Data = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion, year } = request.query;
        const language = lang;

        let varYear = year
        if (!varYear) {
            varYear = 2020
        }

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const chartResult = [
            {
                "id": "produtosAgrotoxicosPerYear",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'produtos_agrotoxicos', labelOfQuery: Internal.languageOb["area1_card"]["produtosAgrotoxicosPerYear"].labelOfQuery['produtos_agrotoxicos'] },
                ],
                "title": Internal.languageOb["area1_card"]["produtosAgrotoxicosPerYear"].title,
                "getText": function (queriesResult, query) {
                    const text = Internal.replacementStrings(Internal.languageOb["area1_card"]["produtosAgrotoxicosPerYear"].text, replacements)
                    return text
                },
                "type": 'line',
                "options": {
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057'
                            }
                        }
                    }
                }
            }
        ]

        let chartFinal = []
        let chartTemp = [{year: 2010}, {year: 2019}]
        for (let chart of chartResult) {
            if(chart.id.includes("produtosAgrotoxicosPerYear")){
                let qr = request.queryResult['produtos_agrotoxicos']
                Object.entries(qr[0]).forEach(([key, value]) => {
                    // console.log(`${key}: ${value}`)
                    let prod = key.split("__");
                    chartTemp.forEach(val => {
                        if(val.year == prod[1]){
                            val[prod[0]] = parseFloat(value)
                        }
                    }) 
                });
            }
        }

        for (let chart of chartResult) {

            chart['data'] = Internal.buildAgrotoxicosTimeseries(chartTemp, chart.idsOfQueriesExecuted[0])
            chart['show'] = false

            if (chart['data']) {
                chart['show'] = true
                chart['text'] = chart.getText(request.queryResult, chart.idsOfQueriesExecuted)
            } else {
                chart['data'] = {};
                chart['show'] = false;
                chart['text'] = "erro."
            }

            chartFinal.push(chart);
        }

        response.send(chartFinal)
        response.end();

    };

    Controller.handleArea2Data = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion, year } = request.query;
        const language = lang;

        let varYear = year
        if (!varYear) {
            varYear = 2020
        }

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const chartResult = [
            {
                "id": "produtosAgrotoxicosPerYear",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'produtos_agrotoxicos', labelOfQuery: Internal.languageOb["area2_card"]["produtosAgrotoxicosPerYear"].labelOfQuery['produtos_agrotoxicos'] },
                ],
                "title": Internal.languageOb["area2_card"]["produtosAgrotoxicosPerYear"].title,
                "getText": function (queriesResult, query) {
                    // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
                    // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    // replacements['areaPasture'] = Internal.numberFormat(Number(queriesResult[query[0].idOfQuery].reduce((n, { value }) => n + parseFloat(value), 0)))
                    // replacements['yearTranslate'] = parseInt(varYear)

                    const text = Internal.replacementStrings(Internal.languageOb["area2_card"]["produtosAgrotoxicosPerYear"].text, replacements)
                    return text
                },
                "type": 'pie',
                "options": {
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057'
                            }
                        }
                    }
                }
            }
            // {
            //     "id": "biomassaPerRegion",
            //     "idsOfQueriesExecuted": [
            //         { idOfQuery: 'biomassa', labelOfQuery: Internal.languageOb["area2_card"]["biomassaPerRegion"].labelOfQuery['biomassa'] },
            //     ],
            //     "title": Internal.languageOb["area2_card"]["biomassaPerRegion"].title,
            //     "getText": function (chart) {
            //         // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
            //         // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
            //         // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

            //         const text = Internal.replacementStrings(Internal.languageOb["area2_card"]["biomassaPerRegion"].text, replacements)
            //         return text
            //     },
            //     "type": 'pie',
            //     "options": {
            //         plugins: {
            //             legend: {
            //                 labels: {
            //                     color: '#495057'
            //                 }
            //             }
            //         }
            //     }
            // },
        ]

        let chartFinal = []
        let chartTemp = [{year: 2010}, {year: 2019}]
        for (let chart of chartResult) {
            if(chart.id.includes("produtosAgrotoxicosPerYear")){
                let qr = request.queryResult['produtos_agrotoxicos']
                Object.entries(qr[0]).forEach(([key, value]) => {
                    // console.log(`${key}: ${value}`)
                    let prod = key.split("_");
                    chartTemp.forEach(val => {
                        if(val.year == prod[1]){
                            val[prod[0]] = parseFloat(value)
                        }
                    }) 

                });
            }
        }

        for (let chart of chartTemp) {

            chart['data'] = Internal.buildGraphResult(request.queryResult, chart)
            chart['show'] = false

            if (chart['data']) {
                chart['show'] = true
                chart['text'] = chart.getText(request.queryResult, chart.idsOfQueriesExecuted)
            } else {
                chart['data'] = {};
                chart['show'] = false;
                chart['text'] = "erro."
            }

            chartFinal.push(chart);
        }



        response.send(chartTemp)
        response.end();
    };

    Controller.handleArea3Data = function (request, response) {

        const { lang, typeRegion, valueRegion, textRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const chartResult = [
            {
                "id": "pastureRankings",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'estados', labelOfQuery: Internal.languageOb["area3_card"]["pastureRankingStates"].labelOfQuery['estados'] },
                ],
                "title": Internal.languageOb["area3_card"]["pastureRankingStates"].title,
                "getText": function (chart) {
                    // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
                    // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    const text = Internal.replacementStrings(Internal.languageOb["area3_card"]["pastureRankingStates"].text, replacements)
                    return text
                },
                "type": 'bar',
                "options": {
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#495057'
                            },
                            grid: {
                                color: '#ebedef'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#495057'
                            },
                            grid: {
                                color: '#ebedef'
                            }
                        }
                    }
                }
            },
        ]

        let chartFinal = []
        for (let chart of chartResult) {

            chart['data'] = Internal.buildGraphResult(request.queryResult, chart)
            chart['show'] = false

            if (chart['data']) {
                chart['show'] = true
                chart['text'] = chart.getText(request.queryResult, chart.idsOfQueriesExecuted)
            } else {
                chart['data'] = {};
                chart['show'] = false;
                chart['text'] = "erro."
            }

            chartFinal.push(chart);
        }

        response.send(chartFinal)
        response.end()

    };

    Controller.handleTableRankings = function (request, response) {
        const { lang, typeRegion, valueRegion, textRegion } = request.query;
        const language = lang;

        Internal.languageOb = UtilsLang().getLang(language).right_sidebar;

        let replacements = {
            typeRegionTranslate: Internal.languageOb.region_types[typeRegion],
            textRegionTranslate: textRegion,
        };

        const tablesDescriptor = [
            {
                "id": "intoxicacaoRankingsCities",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'intoxicacao', labelOfQuery: Internal.languageOb["area_table_card"]["intoxicacaoRankingsCities"].labelOfQuery['intoxicacao'] },
                ],
                "title": Internal.languageOb["area_table_card"]["intoxicacaoRankingsCities"].title,
                "columnsTitle": Internal.languageOb["area_table_card"]["intoxicacaoRankingsCities"].columnsTitle,
                "getText": function (chart) {
                    // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
                    // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    const text = Internal.replacementStrings(Internal.languageOb["area_table_card"]["intoxicacaoRankingsCities"].text, replacements)
                    return text
                },
                "rows_labels": "index?city?uf?value",
            },
            {
                "id": "intoxicacaoMortesRankingsCities",
                "idsOfQueriesExecuted": [
                    { idOfQuery: 'mortes_intoxicacao', labelOfQuery: Internal.languageOb["area_table_card"]["intoxicacaoMortesRankingsCities"].labelOfQuery['mortes_intoxicacao'] },
                ],
                "title": Internal.languageOb["area_table_card"]["intoxicacaoMortesRankingsCities"].title,
                "columnsTitle": Internal.languageOb["area_table_card"]["intoxicacaoMortesRankingsCities"].columnsTitle,
                "getText": function (chart) {
                    // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
                    // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
                    // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

                    const text = Internal.replacementStrings(Internal.languageOb["area_table_card"]["intoxicacaoMortesRankingsCities"].text, replacements)
                    return text
                },
                "rows_labels": "index?city?uf?value",
            },
            // {
            //     "id": "pastureRankingsBiomes",
            //     "idsOfQueriesExecuted": [
            //         { idOfQuery: 'biomas', labelOfQuery: Internal.languageOb["area_table_card"]["pastureRankingsBiomes"].labelOfQuery['biomas'] },
            //     ],
            //     "title": Internal.languageOb["area_table_card"]["pastureRankingsBiomes"].title,
            //     "columnsTitle": Internal.languageOb["area_table_card"]["pastureRankingsBiomes"].columnsTitle,
            //     "getText": function (chart) {
            //         // replacements['areaMun'] = Number(chart['indicators'][0]["area_mun"])
            //         // replacements['anthropicArea'] = chart['indicators'].reduce((a, { value }) => a + value, 0);
            //         // replacements['percentArea'] = (replacements['anthropicArea'] / replacements['areaMun']) * 100.0;

            //         const text = Internal.replacementStrings(Internal.languageOb["area_table_card"]["pastureRankingsBiomes"].text, replacements)
            //         return text
            //     },
            //     "rows_labels": "index?biome?value",
            // }
        ]


        let resultFinal = []
        for (let res of tablesDescriptor) {

            res['data'] = Internal.buildTableData(request.queryResult, res)
            res['show'] = false

            if (res['data']) {
                res['show'] = true
                res['text'] = res.getText(request.queryResult, res.idsOfQueriesExecuted)
            } else {
                res['data'] = {};
                res['show'] = false;
                res['text'] = "erro."
            }

            resultFinal.push(res);
        }

        response.send(resultFinal)
        response.end()
    };


    return Controller;
}