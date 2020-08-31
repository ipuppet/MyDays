const BaseUI = require("/scripts/ui/components/base-ui")

class Factory extends BaseUI {
    constructor(kernel) {
        super(kernel)
        // 视图与菜单对应关系
        this.page_index = [// 通过索引获取页面id
            "home",// 0 => 首页
            "setting"// 1 => 设置
        ]
        // 视图
        this.views = [
            this.home(),
            this.setting()
        ]
        // 菜单
        this.menus = [
            {
                icon: ["house", "house.fill"],
                title: $l10n("HOME")
            },
            {
                icon: "gear",
                title: $l10n("SETTING")
            }
        ]
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
}

module.exports = Factory