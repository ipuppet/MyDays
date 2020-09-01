const BaseUI = require("/scripts/ui/components/base-ui")

class Factory extends BaseUI {
    constructor(kernel) {
        super(kernel)
    }

    home() {
        const HomeUI = require("./home")
        let ui_interface = new HomeUI(this.kernel, this)
        return this.creator(ui_interface.get_views(), 0)
    }

    setting() {
        const SettingUI = require("./setting")
        let ui_interface = new SettingUI(this.kernel, this)
        return this.creator(ui_interface.get_views(), 1)
    }

    /**
     * 渲染页面
     */
    async render() {
        // 视图
        this.set_views([
            this.home(),
            this.setting()
        ])
        // 菜单
        this.set_menus([
            {
                icon: ["house", "house.fill"],
                title: $l10n("HOME")
            },
            {
                icon: "gear",
                title: $l10n("SETTING")
            }
        ])
        super.render()
    }
}

module.exports = Factory