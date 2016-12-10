"use strict";

exports.handler = (event, context, callback) => {
    
    // Sort arrays of objects in ascending order.
    function __arraySortAscending(o, key) {
        return o.sort(function (a, b) {
            if (+a[key] > +b[key]) { return 1; }
            if (+a[key] < +b[key]) { return -1; }
            return 0;
        });
    }

    // Sort arrays of objects in descending order.
    function __arraySortDescending(o, key) {
        return o.sort(function (a, b) {
            if (+a[key] > +b[key]) { return -1; }
            if (+a[key] < +b[key]) { return 1; }
            return 0;
        });
    }
    
    // The data provided by BigQuery.
    var rows = event.data;
    
    // Basic objects to hold the data.
    var persons = {};
    var themes = {};

    // Cycles through the retrieved rows, which need a fair amount of parsing and munging to be usable.
    // Most of the data per column has been aggregated into semicolon or comma-delimited strings.
    for (let r in rows) {
        if (r) {

            // Persons and places
            let item = rows[r].f;
            if (item.length !== 3 || item[0].v === null || item[1].v === null || item[2].v === null) { continue; }
            let names = item[1].v.split(";");
            for (let n in names) {
                if (n) {
                    let name = names[n].split(",")[0];
                    if (name.includes("Hillary Clinton")) {
                        name = "Hillary Clinton";
                    }
                    if (name.length > 0 && !persons[name]) {
                        persons[name] = 1;
                    }
                    if (persons[name]) {
                        persons[name]++;
                    }
                }
            }

                        // Show names
                        let show = item[0].v.split("_");
                        show = show.splice(3, show.length).join(" ").replace("  ", " ").replace("OReilly", "O'Reilly").replace("530", "5:30").replace("1000", "10:00");

                        // Themes and topic categories
                        let tlist = item[2].v.split(";");
                        for (let t in tlist) {
                            if (t) {
                                let cat = tlist[t].split(",")[0];
                                
                                // This is a very inefficient way to make some of the categories human readable.
                                // In a full-fledged production version of this lambda function, I would use an API call to translate these.
                                // These codes appear to come from a Twitter-based lexicon.
                                cat = cat.toLowerCase()
                                    .replace("crime_", "")
                                    .replace("econ_worldcurrencies_", "")
                                    .replace("econ_", "")
                                    .replace("epu_cats_", "")
                                    .replace("epu_policy_", "")
                                    .replace("epu_", "")
                                    .replace("epu_", "")
                                    .replace("tax_fncact_", "")
                                    .replace("tax_", "")
                                    .replace("ungp_", "")
                                    .replace("c07_", "")
                                    .replace("t03_", "")
                                    .replace("slfid_", "")
                                    .replace("worldmammals_", "")
									.replace("worldlanguages_", "")
                                    .replace("soc_pointsofinterest_", "")
                                    .replace("soc_ussecurityagencies", "U.S. security agencies")
                                    .replace("uspec_policy1", "United States policy")
                                    .replace("uspec_politics_general1", "United States politics")
                                    .replace("t11_updatessympathy", "news expressing sympathy")
                                    .replace("armedconflict", "armed conflict")
                                    .replace(/wb_([0-9]+)_/gi, "")
                                    .replace("crisislex_", "")
                                    .replace("crisislexrec", "crisis")
                                    .split("_").join(" ");
                                
                                if (cat && cat.length > 0 && !themes[cat]) {
                                    themes[cat] = {
                                        count: 1,
                                        show: {},
                                        url: "https://www.google.com/search?hl=en&gl=us&tbm=nws&authuser=0&q=" + cat.toLowerCase().split("_").join("+"),
                                        totalThemeReferencesByShowCountCheck: 1
                                    };
                                }
                                if (themes[cat] && themes[cat].count) {
                                    themes[cat].count++;
                                    themes[cat].totalThemeReferencesByShowCountCheck++;
                                }
                                let base = themes[cat];
                                if (themes[cat] && !base.show[show]) {
                                    base.show[show] = 1;
                                }
                                if (themes[cat] && base.show[show]) {
                                    base.show[show]++;
                                }
                            }
                        }
                    }
                }

                // Second pass for final use for each of the three types of data.
                let personsFinal = [];
                let personsKeys = Object.keys(persons);
                for (let key of personsKeys) {
                    personsFinal.push({
                        value: key,
                        count: (persons[key]).toLocaleString(),
                        url: "https://www.google.com/search?q=" + key.toLowerCase().split(" ").join("+")
                    });
                }
                personsFinal = __arraySortDescending(personsFinal, "count");
                let personsFinalDupe = __arraySortAscending(personsFinal.slice(0), "count");

                let themesFinal = [];
                let themesKeys = Object.keys(themes);
                for (let key of themesKeys) {
                    themesFinal.push({
                        value: key,
                        count: (themes[key].count).toLocaleString(),
                        url: themes[key].url,
                        show: themes[key].show,
                        totalThemeReferencesByShowCountCheck: themes[key].totalThemeReferencesByShowCountCheck
                    });
                }
                themesFinal = __arraySortDescending(themesFinal, "count");
                let themesFinalDupe = __arraySortAscending(themesFinal.slice(0), "count");

                // The shows data is partially derivative of the themes data, so both first and second pass are done here.
                let shows = {};
                for (let tf in themesFinal) {
                    if (tf) {
                        let showObj = themesFinal[tf].show;
                        for (let key in showObj) {
                            if (key) {
                                if (!shows[key]) {
                                    shows[key] = {
                                        count: 1,
                                        url: "https://www.google.com/search?q=" + key.toLowerCase().split(" ").join("+"),
                                        themes: {
                                            [themesFinal[tf].value]: themesFinal[tf].count
                                        }
                                    };
                                } else {
                                    shows[key].count++;
                                }
                                let checkTheme = shows[key].themes;
                                if (!checkTheme[themesFinal[tf].value]) {
                                    checkTheme[themesFinal[tf].value] = themesFinal[tf].count;
                                }
                            }
                        }
                    }
                }
                let showsFinal = [];
                let showsKeys = Object.keys(shows);
                for (let key of showsKeys) {
                    showsFinal.push({
                        value: key,
                        count: (shows[key].count).toLocaleString(),
                        url: shows[key].url,
                        themes: shows[key].themes,
                        uniqueThemeCountCheck: Object.keys(shows[key].themes).length
                    });
                }
                showsFinal = __arraySortDescending(showsFinal, "count");
                let showsFinalDupe = __arraySortAscending(showsFinal.slice(0), "count");    
    
    // The final parsed results, organized by categories.
    const result = {
        personsLeast: __arraySortAscending(personsFinal.splice(personsFinalDupe.length - 50, personsFinalDupe.length), "count"),
        themesLeast: __arraySortAscending(themesFinal.splice(themesFinalDupe.length - 50, themesFinalDupe.length), "count"),
        showsLeast: __arraySortAscending(showsFinal.splice(showsFinalDupe.length - 50, showsFinalDupe.length), "count"),
        personsMost: personsFinal.splice(0, 50),
        themesMost: themesFinal.splice(0, 50),
        showsMost: showsFinal.splice(0, 50)
    };
    
    // In the JavaScript version of Lambda, this sends the result object back to the browser.
    callback(null, result);
};