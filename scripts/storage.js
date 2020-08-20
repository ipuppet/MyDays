class Storage {
    constructor(setting) {
        this.setting = setting
        this.local_db = "/assets/MyDays.db"
        this.icloud_path = "drive://MyDays/"
        this.icloud_db = this.icloud_path + "MyDays.db"
        this.icloud_auto_db = this.icloud_path + "auto.db"
        this.sqlite = $sqlite.open(this.local_db)
        this.sqlite.update("CREATE TABLE IF NOT EXISTS mydays(id INTEGER PRIMARY KEY NOT NULL, title TEXT, describe TEXT, date TEXT, style TEXT)")
    }

    parse(result) {
        if (result.error !== null) {
            $console.error(result.error)
            return false
        }
        let data = []
        while (result.result.next()) {
            data.push({
                id: result.result.get('id'),
                title: result.result.get('title'),
                describe: result.result.get('describe'),
                date: result.result.get('date'),
                style: JSON.parse(result.result.get('style')),
            })
        }
        // result.result.close()
        return data
    }

    all() {
        let result = this.sqlite.query("SELECT * FROM mydays ORDER BY date ASC")
        return this.parse(result)
    }

    search(kw) {
        let result = this.sqlite.query({
            sql: "SELECT * FROM mydays WHERE title like ?",
            args: [`%${kw}%`]
        })
        let data = this.parse(result)
        return data
    }

    save(myday) {
        let result = null
        myday.style = myday.style ? myday.style : []
        result = this.sqlite.update({
            sql: "INSERT INTO mydays (title, describe, date, style) values(?, ?, ?, ?)",
            args: [myday.title, myday.describe, myday.date, JSON.stringify(myday.style)]
        })
        if (result.result) {
            if (this.setting.get("setting.backup.auto_backup")) {
                if (!$file.exists(this.icloud_path)) {
                    $file.mkdir(this.icloud_path)
                }
                $file.write({
                    data: $data({ path: this.local_db }),
                    path: this.icloud_auto_db
                })
            }
            return true
        }
        $console.error(result.error)
        return false
    }

    has_backup() {
        return $file.exists(this.icloud_db)
    }

    backup_to_iCloud() {
        if (!$file.exists(this.icloud_path)) {
            $file.mkdir(this.icloud_path)
        }
        return $file.write({
            data: $data({ path: this.local_db }),
            path: this.icloud_db
        })
    }

    recover_from_iCloud(data) {
        let result = $file.write({
            data: data,
            path: this.local_db
        })
        if (result) {
            this.sqlite = $sqlite.open(this.local_db)
        }
        return result
    }

    update(myday) {
        let result = null
        result = this.sqlite.update({
            sql: "UPDATE mydays SET title = ?, describe = ?, date = ?,style = ? WHERE id = ?",
            args: [myday.title, myday.describe, myday.date, JSON.stringify(myday.style), myday.id]
        })
        if (result.result) {
            return true
        }
        $console.error(result.error)
        return false
    }

    delete(id) {
        let result = this.sqlite.update({
            sql: "DELETE FROM mydays WHERE id = ?",
            args: [id]
        })
        if (result.result) {
            return true
        }
        $console.error(result.error)
        return false
    }
}

module.exports = Storage