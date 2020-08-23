const Palette = require("/scripts/ui/components/palette")

class ColorUI {
    constructor(kernel, factory) {
        this.kernel = kernel
        this.factory = factory
        this.width = $device.info.screen.width
        this.palette = new Palette()
        $cache.set("rgb_r", 255)
        $cache.set("rgb_g", 255)
        $cache.set("rgb_b", 255)
    }

    push(myday = null, callback = null) {
        if (myday === null) {
            myday = {
                title: "",
                describe: "",
                date: "",
                style: []
            }
        }
        let nav_buttons = [
            {
                type: "button",
                props: {
                    symbol: "checkmark",
                    tintColor: this.factory.text_color,
                    bgcolor: $color("clear")
                },
                layout: make => {
                    make.right.inset(10)
                    make.size.equalTo(20)
                },
                events: {
                    tapped: () => {
                        let rgb = this.palette.rgb
                        callback($rgb(rgb[0], rgb[1], rgb[2]))
                    }
                }
            }
        ]
        let views = [
            {
                type: "view",
                layout: $layout.fill,
                views: [
                    this.palette.template_display(),
                    this.palette.template_tab(),
                    this.palette.hsv_view("hsv_palette"),
                    this.palette.rgb_view("rgb_palette", true),
                ]
            }
        ]
        this.factory.push(views, $l10n("BACK"), nav_buttons)
    }
}

module.exports = ColorUI