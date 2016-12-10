// Import React itself.
import React from "react";

// This plugin handles updating data state from DOM --> App.
import update from "react-addons-update";

// Needed for onTouchTap.
// https://github.com/callemall/material-ui
// https://github.com/callemall/material-ui/issues/5396
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

// ES6 fetch & Promises polyfill.
import fetch from "isomorphic-fetch";
import "es6-promise/auto";

// Import the config objects.
import { config, theme } from "./app.config.js";

// Material UI theme manager. It seems to prefer receiving an anonymous object literal
// instead of a reference to a configuration object from the app.config.js file.
// This is a required wrapper for the component library used in the project.
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
const muiTheme = getMuiTheme({
  fontFamily: theme.text.font,
  raisedButton: {
    primaryColor: theme.colors.blue.base,
    secondaryColor: theme.colors.blue.base
  }
});

// Material UI components.
import {List, ListItem} from 'material-ui/List';
import RaisedButton from "material-ui/RaisedButton";

// Base class for the entire app.
class App extends React.Component {

    // Initiates the app components. This app has a very flat structure; in a more complicated view,
    // the "props" argument would contain data from parent components.
    constructor(props) {
        super(props);

        // State data object - for mutable data.
        this.state = {
            current: {
                header: config.data.headers.loading,
                list: []
            }
        };

        // Functions need to be bound inside the constructor to retain proper scope.
        this.handleLink = this.handleLink.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    // This is an old version that did not use AWS Lambda, but local browser processing instead.
    // componentDidMount() {
    //
    //     const app = this;
    //     let timeoutID = window.setInterval(retrieveAndMungeData, 500);
    //     function retrieveAndMungeData() {
    //         if (window.app.json &&
    //             window.app.json.result &&
    //             window.app.json.result.rows &&
    //             window.app.json.result.rows.length > 0 &&
    //             typeof window.app.json.result.rows === "object" &&
    //             window.app.json.result.rows instanceof Array) {
    //
    //             // End the interval timer when it's no longer needed.
    //             window.clearInterval(timeoutID);
    //
    //             // Basic objects to hold the retrieved data.
    //             var persons = {};
    //             var themes = {};
    //             var rows = window.app.json.result.rows;
    //
    //             // Cycles through the retrieved rows, which need a fair amount of parsing and munging to be usable.
    //             for (let r in rows) {
    //                 if (r) {
    //
    //                     // Persons and places
    //                     let item = rows[r].f;
    //                     if (item.length !== 3 || item[0].v === null || item[1].v === null || item[2].v === null) { continue; }
    //                     let names = item[1].v.split(";");
    //                     for (let n in names) {
    //                         if (n) {
    //                             let name = names[n].split(",")[0];
    //                             if (name.includes("Hillary Clinton")) {
    //                                 name = "Hillary Clinton";
    //                             }
    //                             if (name.length > 0 && !persons[name]) {
    //                                 persons[name] = 1;
    //                             }
    //                             if (persons[name]) {
    //                                 persons[name]++;
    //                             }
    //                         }
    //                     }
    //
    //                     // Show names
    //                     let show = item[0].v.split("_");
    //                     show = show.splice(3, show.length).join(" ").replace("  ", " ").replace("OReilly", "O'Reilly").replace("530", "5:30").replace("1000", "10:00");
    //
    //                     // Themes and topic categories
    //                     let tlist = item[2].v.split(";");
    //                     for (let t in tlist) {
    //                         if (t) {
    //                             let cat = tlist[t].split(",")[0];
    //                             if (cat && cat.length > 0 && !themes[cat]) {
    //                                 themes[cat] = {
    //                                     count: 1,
    //                                     show: {},
    //                                     url: "https://www.google.com/search?hl=en&gl=us&tbm=nws&authuser=0&q=" + cat.toLowerCase().split("_").join("+"),
    //                                     totalThemeReferencesByShowCountCheck: 1
    //                                 };
    //                             }
    //                             if (themes[cat] && themes[cat].count) {
    //                                 themes[cat].count++;
    //                                 themes[cat].totalThemeReferencesByShowCountCheck++;
    //                             }
    //                             let base = themes[cat];
    //                             if (themes[cat] && !base.show[show]) {
    //                                 base.show[show] = 1;
    //                             }
    //                             if (themes[cat] && base.show[show]) {
    //                                 base.show[show]++;
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //
    //             // Second pass for final use for each of the three types of data.
    //             let personsFinal = [];
    //             let personsKeys = Object.keys(persons);
    //             for (let key of personsKeys) {
    //                 personsFinal.push({
    //                     value: key,
    //                     count: persons[key],
    //                     url: "https://www.google.com/search?q=" + key.toLowerCase().split(" ").join("+")
    //                 });
    //             }
    //             personsFinal = app.__arraySortDescending(personsFinal, "count");
    //             let personsFinalDupe = app.__arraySortAscending(personsFinal.slice(0), "count");
    //
    //             let themesFinal = [];
    //             let themesKeys = Object.keys(themes);
    //             for (let key of themesKeys) {
    //                 let cleanedKey = key.toLowerCase()
    //                     .replace("crime_", "")
    //                     .replace("econ_worldcurrencies_", "World Currencies: ")
    //                     .replace("econ_", "")
    //                     .replace("epu_cats_", "")
    //                     .replace("epu_policy_", "")
    //                     .replace("epu_", "")
    //                     .split("_").join(" ");
    //                 themesFinal.push({
    //                     value: cleanedKey,
    //                     count: themes[key].count,
    //                     url: themes[key].url,
    //                     show: themes[key].show,
    //                     totalThemeReferencesByShowCountCheck: themes[key].totalThemeReferencesByShowCountCheck
    //                 });
    //             }
    //             themesFinal = app.__arraySortDescending(themesFinal, "count");
    //             let themesFinalDupe = app.__arraySortAscending(themesFinal.slice(0), "count");
    //
    //             // The shows data is partially derivative of the themes data, so both first and second pass are done here.
    //             let shows = {};
    //             for (let tf in themesFinal) {
    //                 if (tf) {
    //                     let showObj = themesFinal[tf].show;
    //                     for (let key in showObj) {
    //                         if (key) {
    //                             if (!shows[key]) {
    //                                 shows[key] = {
    //                                     count: 1,
    //                                     url: "https://www.google.com/search?q=" + key.toLowerCase().split(" ").join("+"),
    //                                     themes: {
    //                                         [themesFinal[tf].value]: themesFinal[tf].count
    //                                     }
    //                                 };
    //                             } else {
    //                                 shows[key].count++;
    //                             }
    //                             let checkTheme = shows[key].themes;
    //                             if (!checkTheme[themesFinal[tf].value]) {
    //                                 checkTheme[themesFinal[tf].value] = themesFinal[tf].count;
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //             let showsFinal = [];
    //             let showsKeys = Object.keys(shows);
    //             for (let key of showsKeys) {
    //                 showsFinal.push({
    //                     value: key,
    //                     count: shows[key].count,
    //                     url: shows[key].url,
    //                     themes: shows[key].themes,
    //                     uniqueThemeCountCheck: Object.keys(shows[key].themes).length
    //                 });
    //             }
    //             showsFinal = app.__arraySortDescending(showsFinal, "count");
    //             let showsFinalDupe = app.__arraySortAscending(showsFinal.slice(0), "count");
    //
    //             // Assign the data to the app's view state.
    //             const newState = update(app.state, {
    //                 current: {
    //                     header: { $set: rows.length + " news shows processed. " + config.data.headers.default }
    //                 },
    //                 personsLeast: { $set: app.__arraySortAscending(personsFinal.splice(personsFinalDupe.length - 50, personsFinalDupe.length), "count") },
    //                 themesLeast: { $set: app.__arraySortAscending(themesFinal.splice(themesFinalDupe.length - 50, themesFinalDupe.length), "count") },
    //                 showsLeast: { $set: app.__arraySortAscending(showsFinal.splice(showsFinalDupe.length - 50, showsFinalDupe.length), "count") },
    //                 personsMost: { $set: personsFinal.splice(0, 50) },
    //                 themesMost: { $set: themesFinal.splice(0, 50) },
    //                 showsMost: { $set: showsFinal.splice(0, 50) }
    //             });
    //             app.setState(newState, () => {
    //                 console.log("\nApp.componentDidMount() data ready:", app.state);
    //             });
    //
    //         }
    //     }
    // }

    // Called after the first DOM render. Only called once.
    //
    // React documentation suggests that this part of the loading cycle normally a good place
    // to retrieve and load data. In this app, the query to BigQuery is async, and made when
    // the original index.html page loads - that is because Google's Node.js API is in beta
    // and does not seems to be very reliable when used directly from inside a React view.
    //
    // This uses an interval loop to check for results from BigQuery, then sends it to an
    // AWS Lambda function for processing.
    componentDidMount() {

        const app = this;
        let timeoutID = window.setInterval(retrieveAndMungeData, 500);
        function retrieveAndMungeData() {
            if (window.app.json &&
                window.app.json.result &&
                window.app.json.result.rows &&
                window.app.json.result.rows.length > 0 &&
                typeof window.app.json.result.rows === "object" &&
                window.app.json.result.rows instanceof Array) {

                // End the interval timer when it's no longer needed.
                window.clearInterval(timeoutID);

                var rows = window.app.json.result.rows;
                fetch(
                    "https://b7n7c0shn7.execute-api.us-east-1.amazonaws.com/Final",
                    {
                        method: "POST",
                        body: JSON.stringify({ data: rows })
                    }
                ).then((res) => {
                    if (res && res.ok) {
                        res.json().then((json) => {

                            console.log("\nApp.componentDidMount() POST to AWS Lambda returned JSON:", json);

                            // Assign the processed data to the app's view state.
                            const newState = update(app.state, {
                                current: {
                                    header: { $set: (rows.length).toLocaleString() + " broadcasts processed dating from " + window.app.date + " to present." }
                                },
                                personsLeast: { $set: json.personsLeast },
                                themesLeast: { $set: json.themesLeast },
                                showsLeast: { $set: json.showsLeast },
                                personsMost: { $set: json.personsMost },
                                themesMost: { $set: json.themesMost },
                                showsMost: { $set: json.showsMost }
                            });
                            app.setState(newState, () => {
                                console.log("\nApp.componentDidMount() data ready:", app.state);
								app.__findWordMods();
                            });
							
							// The temporary storage object is no longer needed, so it's deleted.
							window.app = null;

                        });
                    } else {
                        console.log("\nApp.componentDidMount() POST to AWS Lambda response issue:", res);
                    }
                }).catch(function(error) {
                    console.log("\nApp.componentDidMount() POST to AWS Lambda response error:", error);
                });
            }
        }
    }

    // Sort arrays of objects in ascending order.
    __arraySortAscending(o, key) {
        return o.sort(function (a, b) {
            if (a[key] > b[key]) { return 1; }
            if (a[key] < b[key]) { return -1; }
            return 0;
        });
    }

    // Sort arrays of objects in descending order.
    __arraySortDescending(o, key) {
        return o.sort(function (a, b) {
            if (a[key] > b[key]) { return -1; }
            if (a[key] < b[key]) { return 1; }
            return 0;
        });
    }

    // Handles changing the app's current data state on left menu button clicks.
    handleLink(e) {

        // This ensures that the React synthetic event is preserved as an ordinary DOM event,
        // which is needed to extract the event target value, etc.
        e.persist();
        e.preventDefault();
        e.stopPropagation();

        // Get the selected list item's Google search URL and open the search in a new tab.
        const link = e.target.parentNode.parentNode.parentNode.getAttribute("data-url"); console.log(link);
        const win = window.open(link, "_blank");
        win.focus();
    }

    // Handles changing the app's current data state on left menu button clicks.
    handleSelect(e) {

        // This ensures that the React synthetic event is preserved as an ordinary DOM event,
        // which is needed to extract the event target value, etc.
        e.persist();
        e.preventDefault();
        e.stopPropagation();

        // Get the selected data list key.
        const selected = e.target.parentNode.parentNode.parentNode.getAttribute("data-field");
		
		// Get the word cloud size modifiers.
		const mods = this.state.mods[selected];
		const max = mods.max || 1;
		const mod = mods.mod || config.cloud.mods.base;
		
		// Get the data list.
        const list = this.state[selected];

        // Update the app state.
        const newState = update(this.state, {
            current: {
                list: { $set: list },
                header: { $set: config.data.headers[selected] }
            }
        });

        const app = this;
        app.setState(newState, function handleSelectCallback() {
            console.log("\nApp.handleSelectCallback(" + selected + "):", app.state.current);

            // Render a word cloud after the managing state data object has updated.
            // A timer is not strictly needed, but useful in case of random browser lag.
            window.setTimeout(() => {
                app.__renderCloud(max, mod);
            }, config.timers.base);
        });
    }

	// Finds the minimum and maximum values in each data set for use in rendering the word cloud.
	__findWordMods() {
		
		let result = { 
			personsMost: {},
			personsLeast: {},
			themesMost: {}, 
			themesLeast: {},
			showsMost: {},
			showsLeast: {} 
		};
		const list = Object.keys(result);
		for (let item of list) {
			let min = window.d3.max(this.state[item], (d) => { return d.count; });
			let max = window.d3.min(this.state[item], (d) => { return d.count; });
			var mod;
			if (max === min || max - min < config.cloud.mods.compressed) {
				mod = config.cloud.mods.compressed;
			} else {
				mod = config.cloud.mods.base;
			}
			result[item] = {
				min: parseInt(min, 10),
				max: parseInt(max, 10),
				mod: mod
			}
		}
		
		// Update the app state.
        const newState = update(this.state, {
            mods: { $set: result }
        });
		this.setState(newState, function __findWordModsCallback() {
            console.log("\nApp.__findWordModsCallback():", this.state.mods);
        });
	}
	
    // Renders the word cloud.
    // Sources:
    //      D3:              https://github.com/d3/d3
    //      Cloud layout:    https://github.com/jasondavies/d3-cloud
    __renderCloud(max, mod) {

		// Establish some basic config values.
        const app = this;
        const font = theme.text.font.base;

		// Run the layout algorithm from the D3 plugin.
        let layout = window.d3.layout.cloud()
            .size([config.cloud.mods.x, config.cloud.mods.y])
            .words(app.state.current.list.map((d) => {
                return {
                    text: d.value,
                    size: config.cloud.mods.word + Math.sqrt(d.count / max) * mod,
                    url: d.url
                };
            }))
            .padding(config.cloud.mods.pad)
            .rotate(() => { return (Math.random() * 2) * config.cloud.mods.rotation; })
            .font(font)
            .fontSize((d) => { return d.size; })
            .on("end", draw);
        layout.start();

		// D3 can be finicky about variable and data scoping. Nesting this function
		// is a convenient way to control its scope and prevent data/DOM leakage.
        function draw() {

            window.d3.select("#cloud")
                .html("")
                .append("svg")
                .attr("id", "svg-base")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(layout.words())
                .enter()
                .append("text")
                .style("font-size", (d) => { return d.size + "px"; })
                .style("font-family", font)
                .style("fill", (d, i) => {
                    if (i > config.cloud.mods.cap - 1) {
                        i -= config.cloud.mods.cap;
                    }
                    return config.cloud.colors[i] || theme.colors.green;
                })
                .attr("text-anchor", "middle")
                .attr("transform", () => {
                    return "translate(0, 0) rotate(0)";
                })
                .text(function(d) { return d.text; })
                .transition()
                .duration(config.timers.slow)
                .attr("transform", (d) => {
                    return "translate(" + [d.x, d.y] + ") rotate(" + d.rotate + ")";
                });
        }
    }

    // Main rendering routine containing the app view DOM template.
    // Note that Material UI components need to be individually wrapped in <MuiThemeProvider muiTheme={muiTheme}> wrapper elements.
    render() {

        return (

            <div style={config.app.style} id="app">

                <header style={config.headers.style.app} id="header-app">
                    <div style={config.headers.style.mainline}>{config.headers.mainline}</div>
                    <div style={config.headers.style.tagline}><em>{config.headers.tagline}</em></div>
                </header>

                <div style={config.main.style} id="main">

                    <div style={config.left.style} id="left">

                        <div style={config.buttons.style.wrapper} id="wrapper-buttons">

                            <MuiThemeProvider muiTheme={muiTheme}>
                                <RaisedButton
                                    label={config.buttons.labels.personsMost}
                                    primary={true}
                                    buttonStyle={config.buttons.style.base}
                                    onClick={this.handleSelect}
                                    data-field={"personsMost"}
                                />
                            </MuiThemeProvider>

                            <div style={config.buttons.style.divider}> </div>

                            <MuiThemeProvider muiTheme={muiTheme}>
                                <RaisedButton
                                    label={config.buttons.labels.personsLeast}
                                    primary={true}
                                    buttonStyle={config.buttons.style.base}
                                    onClick={this.handleSelect}
                                    data-field={"personsLeast"}
                                />
                            </MuiThemeProvider>

                            <div style={config.buttons.style.divider}> </div>

                            <MuiThemeProvider muiTheme={muiTheme}>
                                <RaisedButton
                                    label={config.buttons.labels.themesMost}
                                    primary={true}
                                    buttonStyle={config.buttons.style.base}
                                    onClick={this.handleSelect}
                                    data-field={"themesMost"}
                                />
                            </MuiThemeProvider>

                            <div style={config.buttons.style.divider}> </div>

                            <MuiThemeProvider muiTheme={muiTheme}>
                                <RaisedButton
                                    label={config.buttons.labels.themesLeast}
                                    primary={true}
                                    buttonStyle={config.buttons.style.base}
                                    onClick={this.handleSelect}
                                    data-field={"themesLeast"}
                                />
                            </MuiThemeProvider>

                            <div style={config.buttons.style.divider}> </div>

                            <MuiThemeProvider muiTheme={muiTheme}>
                                <RaisedButton
                                    label={config.buttons.labels.showsMost}
                                    primary={true}
                                    buttonStyle={config.buttons.style.base}
                                    onClick={this.handleSelect}
                                    data-field={"showsMost"}
                                />
                            </MuiThemeProvider>

                            <div style={config.buttons.style.divider}> </div>

                            <MuiThemeProvider muiTheme={muiTheme}>
                                <RaisedButton
                                    label={config.buttons.labels.showsLeast}
                                    primary={true}
                                    buttonStyle={config.buttons.style.base}
                                    onClick={this.handleSelect}
                                    data-field={"showsLeast"}
                                />
                            </MuiThemeProvider>

                        </div>

                        <div style={config.list.style.wrapper} id="wrapper-list">

                            <MuiThemeProvider muiTheme={muiTheme}>
                                <List>

                                    {this.state.current.list.map((row, i) => {

                                        if (this.state.current.list.length > 0 && row) {

                                            return (

                                                <ListItem
                                                    key={i}
                                                    primaryText={row.count + ": " + row.value}
                                                    innerDivStyle={config.list.style.item}
                                                    data-url={row.url}
                                                    onClick={this.handleLink}
                                                />

                                            );

                                        } else {
                                            return (
                                                <ListItem
                                                    key={"0"}
                                                    primaryText={config.list.messages.default}
                                                    innerDivStyle={config.list.style.item}
                                                />
                                            );
                                        }
                                    })}

                                </List>
                            </MuiThemeProvider>

                        </div>

                    </div>

                    <div style={config.right.style} id="right">

                        <header style={config.headers.style.messages}>{this.state.current.header}</header>

                        <div style={config.cloud.style} id="cloud"> </div>

                    </div>

                </div>

            </div>
        );
    }
}

// Exports the finalized app as a component to be rendered by the index.js file.
export default App;