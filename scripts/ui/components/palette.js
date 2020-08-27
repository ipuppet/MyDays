class Palette {
    constructor() {
        this.width = $device.info.screen.width
        // 调色器离顶端的距离，因为有两个调色板所以写死高度比较方便
        // 前半部分为预览框高度，+50为选项卡高度，+25为距离选项卡再远25
        this.palette_offset = this.width * 0.5 / 16 * 9 + 50 + 25
        this.hsv = [0, 100, 100]
        this.rgb = Palette.HSV2RGB(this.hsv[0], this.hsv[1], this.hsv[2])
    }

    static HSV2RGB(h, s, v) {
        h = h > 359 ? 0 : h
        s = s / 100
        v = v / 100
        let r = 0, g = 0, b = 0
        let i = parseInt((h / 60) % 6)
        let f = h / 60 - i
        let p = v * (1 - s)
        let q = v * (1 - f * s)
        let t = v * (1 - (1 - f) * s)
        switch (i) {
            case 0:
                r = v
                g = t
                b = p
                break
            case 1:
                r = q
                g = v
                b = p
                break
            case 2:
                r = p
                g = v
                b = t
                break
            case 3:
                r = p
                g = q
                b = v
                break
            case 4:
                r = t
                g = p
                b = v
                break
            case 5:
                r = v
                g = p
                b = q
                break
            default:
                break
        }
        r = r * 255
        g = g * 255
        b = b * 255
        return [Math.ceil(r), Math.ceil(g), Math.ceil(b)]
    }

    static RGB2HSV(r, g, b) {
        r = r / 255
        g = g / 255
        b = b / 255
        let h, s, v
        let min = Math.min(r, g, b)
        let max = v = Math.max(r, g, b)
        let difference = max - min
        if (max === min) {
            h = 0
        } else {
            switch (max) {
                case r:
                    h = (g - b) / difference + (g < b ? 6 : 0)
                    break
                case g:
                    h = 2.0 + (b - r) / difference
                    break
                case b:
                    h = 4.0 + (r - g) / difference
                    break
            }
            h = Math.round(h * 60)
        }
        if (max === 0) {
            s = 0
        } else {
            s = 1 - min / max
        }
        s = Math.round(s * 100)
        v = Math.round(v * 100)
        return [h, s, v]
    }

    static HSV2HEX(h, s, v) {
        let rgb = Palette.HSV2RGB(h, s, v)
        return Palette.RGB2HEX(rgb[0], rgb[1], rgb[2])
    }

    static RGB2HEX(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }

    set_rgb(r, g, b) {
        this.rgb = [r, g, b]
        this.hsv = Palette.RGB2HSV(r, g, b)
    }

    set_hsv(h, s, v) {
        this.hsv = [h, s, v]
        this.rgb = Palette.HSV2RGB(h, s, v)
    }

    display(color) {
        $("color_display").bgcolor = color
    }

    update_hsv() {
        this.rgb = Palette.HSV2RGB(this.hsv[0], this.hsv[1], this.hsv[2])
        // 同步更新rgb
        $("rgb_r_slider").value = this.rgb[0] / 255
        $("rgb_g_slider").value = this.rgb[1] / 255
        $("rgb_b_slider").value = this.rgb[2] / 255
        this.display($rgb(this.rgb[0], this.rgb[1], this.rgb[2]))
    }

    update_rgb() {
        this.hsv = Palette.RGB2HSV(this.rgb[0], this.rgb[1], this.rgb[2])
        // 同步更新hsv
        $("hsv_h_slider").value = this.hsv[0] / 360
        $("hsv_s_slider").value = this.hsv[1] / 100
        $("hsv_v_slider").value = this.hsv[2] / 100
        this.display($rgb(this.rgb[0], this.rgb[1], this.rgb[2]))
    }

    /**
     * 获取完整视图
     */
    get_view() {
        return {
            type: "view",
            layout: $layout.fill,
            views: [
                this.template_display(),
                this.template_tab(),
                this.hsv_view("hsv_palette"),
                this.rgb_view("rgb_palette", true)
            ]
        }
    }

    hsv_view(id, hidden = false) {
        return {
            props: {
                id: id,
                hidden: hidden
            },
            type: "view",
            layout: (make, view) => {
                make.width.equalTo(view.super)
                make.top.equalTo(this.palette_offset)
                make.bottom.inset(0)
            },
            views: [
                this.template_slider("hsv_h", "Hue", [this.hsv[0], "°"],
                    {
                        colors: [$color("#FF0000"), $color("#FFFF00"), $color("#00FF00"), $color("#00FFFF"), $color("#0000FF"), $color("#FF00FF"), $color("#FF0000")],
                        locations: [0.0, 0.125, 0.25, 0.5, 0.75, 0.875, 1.0]
                    },
                    {
                        value: this.hsv[0] / 360,
                        events: value => {
                            this.hsv[0] = Math.ceil(value * 360)
                            this.update_hsv()
                            // 改变下面两个条的颜色，此时 this.rgb 已经更新
                            let rgb = $rgb(this.rgb[0], this.rgb[1], this.rgb[2])
                            $("hsv_s_gradient").colors = [$color("white"), rgb]
                            $("hsv_v_gradient").colors = [$color("black"), rgb]
                            return this.hsv[0]
                        }
                    }, true),
                this.template_slider("hsv_s", "Saturation", [this.hsv[1], "%"],
                    {
                        colors: [$color("white"), $rgb(this.rgb[0], this.rgb[1], this.rgb[2])],
                        locations: [0, 1]
                    },
                    {
                        value: this.hsv[1] / 100,
                        events: value => {
                            this.hsv[1] = Math.ceil(value * 100)
                            this.update_hsv()
                            $("hsv_h_cover_white").alpha = 1 - value
                            return this.hsv[1]
                        }
                    }
                ),
                this.template_slider("hsv_v", "Value", [this.hsv[2], "%"],
                    {
                        colors: [$color("black"), $rgb(this.rgb[0], this.rgb[1], this.rgb[2])],
                        locations: [0, 1]
                    },
                    {
                        value: this.hsv[2] / 100,
                        events: value => {
                            this.hsv[2] = Math.ceil(value * 100)
                            this.update_hsv()
                            $("hsv_h_cover_black").alpha = 1 - value
                            return this.hsv[2]
                        }
                    }
                )
            ]
        }
    }

    rgb_view(id, hidden = false) {
        return {
            props: {
                id: id,
                hidden: hidden
            },
            type: "view",
            layout: (make, view) => {
                make.width.equalTo(view.super)
                make.top.equalTo(this.palette_offset)
                make.bottom.inset(0)
            },
            views: [
                this.template_slider("rgb_r", "Red", [this.rgb[0], ""],
                    {
                        colors: [
                            $rgb(0, this.rgb[1], this.rgb[2]),
                            $rgb(255, this.rgb[1], this.rgb[2])
                        ],
                        locations: [0, 1]
                    },
                    {
                        value: this.rgb[0] / 255,
                        events: value => {
                            this.rgb[0] = Math.ceil(value * 255)
                            this.update_rgb()
                            $("rgb_g_gradient").colors = [
                                $rgb(this.rgb[0], 0, this.rgb[2]),
                                $rgb(this.rgb[0], 255, this.rgb[2])
                            ]
                            $("rgb_b_gradient").colors = [
                                $rgb(this.rgb[0], this.rgb[1], 0),
                                $rgb(this.rgb[0], this.rgb[1], 255)
                            ]
                            return this.rgb[0]
                        }
                    }
                ),
                this.template_slider("rgb_g", "Green", [this.rgb[1], ""],
                    {
                        colors: [
                            $rgb(this.rgb[0], 0, this.rgb[2]),
                            $rgb(this.rgb[0], 255, this.rgb[2])
                        ],
                        locations: [0, 1]
                    },
                    {
                        value: this.rgb[1] / 255,
                        events: value => {
                            this.rgb[1] = Math.ceil(value * 255)
                            this.update_rgb()
                            $("rgb_r_gradient").colors = [
                                $rgb(0, this.rgb[1], this.rgb[2]),
                                $rgb(255, this.rgb[1], this.rgb[2])
                            ]
                            $("rgb_b_gradient").colors = [
                                $rgb(this.rgb[0], this.rgb[1], 0),
                                $rgb(this.rgb[0], this.rgb[1], 255)
                            ]
                            return this.rgb[1]
                        }
                    }
                ),
                this.template_slider("rgb_b", "Blue", [this.rgb[2], ""],
                    {
                        colors: [
                            $rgb(this.rgb[0], this.rgb[1], 0),
                            $rgb(this.rgb[0], this.rgb[1], 255)
                        ],
                        locations: [0, 1]
                    },
                    {
                        value: this.rgb[2] / 255,
                        events: value => {
                            this.rgb[2] = Math.ceil(value * 255)
                            this.update_rgb()
                            $("rgb_r_gradient").colors = [
                                $rgb(0, this.rgb[1], this.rgb[2]),
                                $rgb(255, this.rgb[1], this.rgb[2])
                            ]
                            $("rgb_g_gradient").colors = [
                                $rgb(this.rgb[0], 0, this.rgb[2]),
                                $rgb(this.rgb[0], 255, this.rgb[2])
                            ]
                            return this.rgb[2]
                        }
                    }
                )
            ]
        }
    }

    /**
     * 展示当前颜色
     * @param {String} id UI控件id
     * @param {$color} bgcolor 初始颜色
     */
    template_display(id = "color_display", bgcolor = null) {
        if (bgcolor === null) {
            if (this.hsv) {
                bgcolor = $color(Palette.HSV2HEX(this.hsv[0], this.hsv[1], this.hsv[2]))
            }
        }
        return {
            type: "view",
            props: {
                id: id,
                cornerRadius: 20,
                smoothCorners: true,
                bgcolor: bgcolor
            },
            layout: (make, view) => {
                make.size.equalTo($size(this.width * 0.5, this.width * 0.5 / 16 * 9))
                make.centerX.equalTo(view.super)
                make.top.inset(20)
            }
        }
    }

    /**
     * 选项卡
     */
    template_tab(items = ["HSV", "RGB"]) {
        return {
            type: "tab",
            props: {
                items: items,
                dynamicWidth: true
            },
            events: {
                changed: sender => {
                    if (sender.index === 0) {
                        $("hsv_palette").hidden = false
                        $("rgb_palette").hidden = true
                    } else if (sender.index === 1) {
                        $("hsv_palette").hidden = true
                        $("rgb_palette").hidden = false
                    }
                }
            },
            layout: (make, view) => {
                make.centerX.equalTo(view.super)
                make.height.equalTo(30)
                make.top.equalTo(view.prev.bottom).offset(20)
            }
        }
    }

    /**
     * slider 模板
     * @param {String} id 各组件id前缀
     * @param {String} title 标题
     * @param {Array} value 左侧显示数值 0: 当前数值, 1: 单位
     * @param {Object} gradient 渐变色条
     * @param {Object} slider value: 当前数值, events: value=>{ your code; return value} return的value用于显示
     * @param {*} cover 是否需要遮盖层，覆盖在渐变色条上方控制透明度和明度
     */
    template_slider(id, title, value, gradient, slider, cover = false) {
        const get_cover = (color, alpha) => {
            return {
                type: "view",
                props: {
                    hidden: !cover, // 仅在hsv的h条上显示
                    id: `${id}_cover_${color}`,
                    radius: 2,
                    borderWidth: 0.2,
                    borderColor: $color("systemGray2"),
                    bgcolor: $color(color),
                    alpha: alpha
                },
                layout: (make, view) => {
                    make.centerY.equalTo(view.super)
                    make.size.equalTo($size(this.width - 80, 4))
                    make.left.inset(60)
                }
            }
        }
        return {
            type: "view",
            layout: (make, view) => {
                if (view.prev)
                    make.top.equalTo(view.prev.bottom).offset(25)
                else
                    make.top.equalTo(view.super)
                make.width.equalTo(view.super)
                make.height.equalTo(35)
            },
            views: [
                {
                    type: "label",
                    props: {
                        font: $font(13),
                        text: title
                    },
                    layout: make => {
                        make.top.equalTo(0)
                        make.left.inset(50)
                    }
                },
                {
                    type: "view",
                    layout: (make, view) => {
                        make.top.equalTo(view.prev.bottom).offset(5)
                        make.width.equalTo(view.super)
                        make.height.equalTo(20)
                    },
                    views: [
                        {
                            type: "view",
                            views: [
                                {
                                    type: "label",
                                    props: {
                                        font: $font(13),
                                        text: value[1],
                                        align: $align.left
                                    },
                                    layout: (make, view) => {
                                        make.centerY.equalTo(view.super)
                                        make.right.inset(0)
                                        make.width.equalTo(13)
                                    }
                                },
                                {
                                    type: "label",
                                    props: {
                                        id: `${id}_value`,
                                        font: $font(13),
                                        text: value[0],
                                        align: $align.right
                                    },
                                    layout: (make, view) => {
                                        make.centerY.equalTo(view.super)
                                        make.right.inset(13)
                                        make.width.equalTo(30)
                                    }
                                }
                            ],
                            layout: (make, view) => {
                                make.centerY.equalTo(view.super)
                                make.left.inset(15)
                                make.width.equalTo(40)
                            }
                        },
                        {
                            type: "gradient",
                            props: Object.assign({
                                id: `${id}_gradient`,
                                radius: 2,
                                borderWidth: 0.2,
                                borderColor: $color("systemGray2"),
                                startPoint: $point(0, 1),
                                endPoint: $point(1, 1)
                            }, gradient),
                            layout: (make, view) => {
                                make.centerY.equalTo(view.super)
                                make.size.equalTo($size(this.width - 80, 4))
                                make.left.inset(60)
                            }
                        },
                        get_cover("white", 1 - this.hsv[1] / 100),
                        get_cover("black", 1 - this.hsv[2] / 100),
                        {
                            type: "slider",
                            props: {
                                id: `${id}_slider`,
                                minColor: $color("clear"),
                                maxColor: $color("clear"),
                                value: slider.value
                            },
                            layout: (make, view) => {
                                make.centerY.equalTo(view.super)
                                make.left.width.equalTo(view.prev)
                            },
                            events: {
                                changed: sender => {
                                    $(`${id}_value`).text = slider.events(sender.value)
                                }
                            }
                        }
                    ]
                }
            ]
        }
    }
}

module.exports = Palette