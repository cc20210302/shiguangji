package com.example.shiguangji;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.view.Window;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Paints the window behind Android's transparent status bar with the active
 * page color. This is required on Android 15/16 where StatusBar.backgroundColor
 * is ignored by the platform's enforced edge-to-edge layout.
 */
@CapacitorPlugin(name = "ThemeStatusBar")
public class ThemeStatusBarPlugin extends Plugin {

    @PluginMethod
    public void setBackgroundColor(PluginCall call) {
        String value = call.getString("color");
        if (value == null || value.trim().isEmpty()) {
            call.reject("Missing status bar background color");
            return;
        }

        final int color;
        try {
            color = Color.parseColor(value);
        } catch (IllegalArgumentException error) {
            call.reject("Invalid status bar background color: " + value);
            return;
        }

        getActivity().runOnUiThread(() -> {
            Window window = getActivity().getWindow();
            // The decor/window background is visible through the transparent
            // system status bar when Android enforces edge-to-edge rendering.
            window.setBackgroundDrawable(new ColorDrawable(color));
            window.getDecorView().setBackgroundColor(color);

            // On Android 14 and below the system still honors statusBarColor.
            if (Build.VERSION.SDK_INT < 35) {
                window.setStatusBarColor(color);
            } else {
                window.setStatusBarColor(Color.TRANSPARENT);
            }

            JSObject result = new JSObject();
            result.put("color", value);
            call.resolve(result);
        });
    }
}
