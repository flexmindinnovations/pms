import {createTheme, Loader} from "@mantine/core";
import RingLoader from "@components/RingLoader.jsx";

const defaultSize = '12px';
const defaultRadius = 'lg';
const theme = createTheme({
    colors: {
        brand: [
            "#f3f4f7",
            "#e6e6e6",
            "#c9cace",
            "#a9adb6",
            "#8f94a1",
            "#7d8595",
            "#747d90",
            "#636b7d",
            "#575f71",
            "#485265"
        ],
    },
    primaryColor: 'brand',
    primaryShade: 9,
    defaultRadius,
    components: {
        Loader: Loader.extend({
            defaultProps: {
                loaders: {...Loader.defaultLoaders, ring: RingLoader},
                type: 'ring',
                size: 'xl'
            }
        }),
        Container: {
            styles: () => ({
                root: {
                    height: '100%'
                }
            })
        },
        Button: {
            defaultProps: {
                radius: 'xl',
                loaderProps: {h: '48px', w: '48px'},
            },
        },
        Tooltip: {
            defaultProps: {
                withArrow: true
            },
            styles: () => ({
                tooltip: {
                    fontSize: '12px'
                }
            })
        },
    }
})

export {theme};