const Palette = require("/scripts/ui/components/palette")

class ColorUI {
    constructor(kernel, factory) {
        this.kernel = kernel
        this.factory = factory
        this.width = $device.info.screen.width
        this.palette = new Palette()
    }

    push(color = null, callback = null) {
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
                        // 返回HEX
                        callback(Palette.RGB2HEX(rgb[0], rgb[1], rgb[2]))
                        $ui.pop()
                    }
                }
            }
        ]
        this.palette.set_rgb(color.components.red, color.components.green, color.components.blue)
        let views = [this.palette.get_view()]
        this.factory.push(views, $l10n("BACK"), nav_buttons)
    }
}

module.exports = ColorUI