const data = {
    "playerStats": {
        "players": { "val1": 64, "val2": 64, "sep": "/" },
        "ping": { "val1": 47, "val2": "ms", "sep": "" },
        "tickrate": { "val1": 60, "val2": "Hz", "sep": "" }
    },
    "settingsData": {
        "settings": {
            "region": {"value": "europe - de", "type": "select"},
            "punkbuster": {"value": true, "type": "bool"},
            "fairfight": {"value": true, "type": "bool"},
            "password": {"value": false, "type": "bool"},
            "preset": {"value": "normal", "type": "select"}
        },
        "advanced": {
            "minimap": {"value": true, "type": "bool"},
            "only squad leader spawn": {"value": false, "type": "bool"},
            "vehicles": {"value": true, "type": "bool"},
            "team balance": {"value": true, "type": "bool"},
            "minimap spotting": {"value": true, "type": "bool"},
            "hud": {"value": true, "type": "bool"},
            "3p vehicle cam": {"value": true, "type": "bool"},
            "regenerative health": {"value": true, "type": "bool"},
            "kill cam": {"value": true, "type": "bool"},
            "friendly fire": {"value": false, "type": "bool"},
            "3d spotting": {"value": true, "type": "bool"},
            "enemy name tags": {"value": true, "type": "bool"}
        },
        "rules": {
            "tickets": {"value": 400, "type": "number"},
            "vehicle spawn delay": {"value": 25, "type": "number"},
            "bullet damage": {"value": 100, "type": "number"},
            "kick after team kills": {"value": 5, "type": "number"},
            "player health": {"value": 100, "type": "number"},
            "player respawn time": {"value": 100, "type": "number"},
            "kick after idle": {"value": 300, "type": "number"},
            "ban after kicks": {"value": 3, "type": "number"}
        }
    }
}

export default data;