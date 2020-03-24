-- hs.hotkey.bind({'ctrl', 'cmd'}, ".", function()
--     hs.alert.show("App path:        "
--     ..hs.window.focusedWindow():application():path()
--     .."\n"
--     .."App name:      "
--     ..hs.window.focusedWindow():application():name()
--     .."\n"
--     .."IM source id:  "
--     ..hs.keycodes.currentSourceID())
-- end)

local app = 'com.apple.Safari'

k = hs.hotkey.new({'options'}, 'a', function()
    -- hs.eventtap.event.newKeyEvent({'cmd','option','shift'}, 'v', true):post()
    hs.eventtap.keyStroke({'cmd','option','shift'}, 'v')
end)

function applicationWatcher(appName, eventType, appObject)
    if (eventType == hs.application.watcher.activated) then
        local bundleID = appObject:bundleID()
        if bundleID == app then
            -- hs.alert(bundleID)
            k:enable()
        else
            k:disable()
        end
    end
end

appWatcher = hs.application.watcher.new(applicationWatcher)
appWatcher:start()
