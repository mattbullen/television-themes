// Defines common colors and fonts used throughout the app.
const theme = {
    border: {
        color: "#d5d5d5"
    },
    colors: {
        black: "#000",
        blue: {
            base: "#448aff",
            dark: "#1f3f7f"
        },
        gold: "#fdeec5",            // Darker gold: "#fce297",
        gray: {
            base: "#d5d5d5",
            dark: "#757575"
        },
        green: "#177245",
        red: "#c8232c",             // Pinterest red: http://encycolorpedia.com/c8232c
        white: "#fff"
    },
    hover: {
        color: "#d5d5d5"
    },
    text: {
        color: "#000",
        font: {
            base: "Lato, Arial, sans-serif",
            header: "Raleway, Lato, Arial, sans-serif"
        },
        size: {
            small: "14px",
            standard: "16px",
            large: "18px",
            header: "24px"
        }
    }
};

// Main configuration object. This also holds component CSS not already supplied by the components themselves.
// React design patterns prefer keeping component information together. A separate CSS file is not needed
// unless the app becomes much more complex in structure.
const config = {
    app: {
        style: {
            width: "960px",
            margin: "0 auto",
            boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)"
        }
    },
    buttons: {
        labels: {
            personsMost: "Persons: Most",
            personsLeast: "Persons: Least",
            themesMost: "Themes: Most",
            themesLeast: "Themes: Least",
            showsMost: "Shows: Most Variety",
            showsLeast: "Shows: Least Variety"
        },
        style: {
            base: {
                width: "235px",
                WebkitFontSmoothing: "antialiased",
                textShadow: "1px 1px 1px rgba(0, 0, 0, 0.004)",
                textTransform: "capitalize",
                fontSize: theme.text.size.small
            },
            divider: {
                display: "block",
                height: "5px",
                width: "100%"
            },
            wrapper: {
                padding: "0 0 10px 0",
                borderBottom: "1px solid " + theme.colors.gray.base
            }
        }
    },
    cloud: {
        colors: [
            "#1f77b4",
            "#aec7e8",
            "#ff7f0e",
            "#ffbb78",
            "#2ca02c",
            "#98df8a",
            "#d62728",
            "#ff9896",
            "#9467bd",
            "#c5b0d5",
            "#8c564b",
            "#c49c94",
            "#e377c2",
            "#f7b6d2",
            "#7f7f7f",
            "#c7c7c7",
            "#bcbd22",
            "#dbdb8d",
            "#17becf",
            "#9edae5",
            "#393b79",
            "#5254a3",
            "#6b6ecf",
            "#9c9ede",
            "#637939",
            "#8ca252",
            "#b5cf6b",
            "#cedb9c",
            "#8c6d31",
            "#bd9e39",
            "#e7ba52",
            "#e7cb94",
            "#843c39",
            "#ad494a",
            "#d6616b",
            "#e7969c",
            "#7b4173",
            "#a55194",
            "#ce6dbd",
            "#de9ed6"
        ],
		mods: {
			base: 40,
			compressed: 5,
			cap: 40,
			pad: 5,
			rotation: 90,
			word: 10,
			x: 684, 
			y: 840
		},
        style: {
            margin: "30px 0 0 0"
        }
    },
    data: {
        headers: {
            default: "Use the sidebar menu to load a data set!",
            loading: "Please wait while the app queries GDELT via Google BigQuery.",
            personsMost: "Persons and Places: Most Referenced",
            personsLeast: "Persons and Places: Least Referenced",
            themesMost: "Themes and Categories: Most Referenced",
            themesLeast: "Themes and Categories: Least Referenced",
            showsMost: "News Shows: Most Thematic Variety",
            showsLeast: "News Shows: Least Thematic Variety"
        }
    },
    headers: {
        mainline: "CSCI E-90 Final Project",
        tagline: "What's on TV? A look into thematic outliers in television news using Google BigQuery and AWS Lambda.",
        style: {
            app: {
                width: "100%",
                padding: "10px 0",
                backgroundColor: theme.colors.blue.dark,
                color: theme.colors.white,
                textAlign: "center"
            },
            mainline: {
                height: "30px",
                lineHeight: "30px",
                width: "100%",
                fontSize: theme.text.size.header,
                fontFamily: theme.text.font.header,
                WebkitFontSmoothing: "antialiased",
                textShadow: "1px 1px 1px rgba(0, 0, 0, 0.004)"
            },
            messages: {
                height: "24px",
                lineHeight: "36px",
                width: "684px",
                fontSize: theme.text.size.large,
                fontFamily: theme.text.font.header,
                WebkitFontSmoothing: "antialiased",
                textShadow: "1px 1px 1px rgba(0, 0, 0, 0.004)",
                textAlign: "center"
            },
            tagline: {
                height: "30px",
                lineHeight: "30px",
                width: "100%",
                fontSize: theme.text.size.small,
                fontFamily: theme.text.font.header,
                WebkitFontSmoothing: "antialiased",
                textShadow: "1px 1px 1px rgba(0, 0, 0, 0.004)"
            }
        }
    },
    left: {
        style: {
            display: "inline-block",
            float: "left",
            height: "980px",
            width: "235px",
            padding: "10px 10px 0 10px",
            borderRight: "1px solid " + theme.colors.gray.base
        }
    },
    list: {
        messages: {
            default: "Nothing to display!"
        },
        style: {
            item: {
                fontSize: theme.text.size.small,
                padding: "6px"
            },
            wrapper: {
                height: "705px",
                overflow: "hidden",
                overflowY: "scroll"
            }
        }
    },
    main: {
        style: {
            float: "left",
            height: "990px",
            width: "960px",
            padding: "0",
            backgroundColor: theme.colors.white
        }
    },
    right: {
        style: {
            display: "inline-block",
            float: "left",
            height: "990xpx",
            padding: "10px"
        }
    },
	timers: {
		base: 500,
		slow: 800
	}
};

// Exports the configuration objects for use by the app.js file.
module.exports = { config, theme };