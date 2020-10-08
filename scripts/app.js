const { Kernel, VERSION } = require("../EasyJsBox/src/kernel")
const MainUI = require("./ui/main")
const Storage = require("./storage")

class AppKernel extends Kernel {
    constructor() {
        super()
        // 注册组件
        this.settingComponent = this._registerComponent("Setting")
        this.setting = this.settingComponent.controller
        this.initSettingMethods()
        this.page = this._registerComponent("Page")
        this.menu = this._registerComponent("Menu")
        this.storage = new Storage(this.setting)
        // 注册插件
        this.registerPlugin("palette")
    }

    /**
     * 注入设置中的脚本类型方法
     */
    initSettingMethods() {
        this.setting.readme = () => {
            const content = $file.read("/README.md").string
            this.settingComponent.view.push([{
                type: "markdown",
                props: { content: content },
                layout: (make, view) => {
                    make.size.equalTo(view.super)
                }
            }])
        }

        this.setting.backupToICloud = () => {
            this.settingComponent.view.start()
            const backupAction = () => {
                if (this.storage.backupToICloud()) {
                    $ui.alert($l10n("BACKUP_SUCCESS"))
                    this.settingComponent.view.done()
                } else {
                    $ui.alert($l10n("BACKUP_ERROR"))
                    this.settingComponent.view.cancel()
                }
            }
            if (this.storage.hasBackup()) {
                $ui.alert({
                    title: $l10n("BACKUP"),
                    message: $l10n("ALREADY_HAS_BACKUP"),
                    actions: [
                        {
                            title: $l10n("OK"),
                            handler: () => {
                                backupAction()
                            }
                        },
                        {
                            title: $l10n("CANCEL"),
                            handler: () => { this.settingComponent.view.cancel() }
                        }
                    ]
                })
            } else {
                backupAction()
            }
        }

        this.setting.recoverFromICloud = () => {
            this.settingComponent.view.start()
            $drive.open({
                handler: data => {
                    if (this.storage.recoverFromICloud(data)) {
                        // 更新列表
                        let home = require("./ui/main/home")
                        home.setData(this.storage.all())
                        this.settingComponent.view.done()
                    } else {
                        this.settingComponent.view.cancel()
                    }
                }
            })
        }
    }
}

module.exports = {
    run: () => {
        // 实例化应用核心
        let kernel = new AppKernel()
        // 渲染UI
        new MainUI(kernel).render()
    }
}