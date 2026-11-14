package com.example.shiguangji;

import android.graphics.Color;
import android.os.Build;
import android.view.Gravity;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.view.WindowInsets;
import android.widget.FrameLayout;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Paints the Android status-bar strip without changing WebView measurement.
 * Android 14 and below use Window.statusBarColor. Android 15+ enforces
 * edge-to-edge, so a fixed-height, non-interactive view is placed at the top
 * of DecorView. Updating its color never changes its layout parameters.
 */
@CapacitorPlugin(name = "ThemeStatusBar")
public class ThemeStatusBarPlugin extends Plugin {
    // 🌟 删除了 String 类型的 TAG 定义

    private FrameLayout decorView;
    private View statusBarScrim;
    private ViewTreeObserver.OnGlobalLayoutListener layoutListener;
    private int lastInsetHeight = -1;

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

        if (getActivity() == null) {
            call.reject("Activity is not available");
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                Window window = getActivity().getWindow();
                if (Build.VERSION.SDK_INT < 35) {
                    // Native system status bar background on Android 7-14.
                    window.setStatusBarColor(color);
                } else {
                    // Android 15/16 ignores statusBarColor for edge-to-edge apps.
                    // Keep the system bar transparent and paint its inset strip.
                    window.setStatusBarColor(Color.TRANSPARENT);
                    ensureStatusBarScrim(window);
                    statusBarScrim.setBackgroundColor(color);
                    updateScrimHeight();
                }

                JSObject result = new JSObject();
                result.put("color", value);
                call.resolve(result);
            } catch (Exception error) {
                call.reject("Unable to update status bar background", error);
            }
        });
    }

    private void ensureStatusBarScrim(Window window) {
        if (statusBarScrim != null) return;

        View decor = window.getDecorView();
        if (!(decor instanceof FrameLayout)) {
            throw new IllegalStateException("Android DecorView is not a FrameLayout");
        }

        decorView = (FrameLayout) decor;

        // 🌟 核心修复：使用无参的 getTag() 获取标签，解决类型不兼容报错
        Object existing = decorView.getTag();
        if (existing instanceof View) {
            statusBarScrim = (View) existing;
        } else {
            statusBarScrim = new View(getActivity());
            // 🌟 核心修复：使用无参的 setTag() 设置标签
            statusBarScrim.setTag(statusBarScrim);

            statusBarScrim.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);
            statusBarScrim.setClickable(false);
            statusBarScrim.setFocusable(false);
            statusBarScrim.setElevation(dp(32));

            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    Math.max(1, getStatusBarInsetHeight()),
                    Gravity.TOP
            );
            // Add as a fixed-size sibling above the WebView. FrameLayout's
            // parent size remains unchanged; this view cannot consume content space.
            decorView.addView(statusBarScrim, params);
            statusBarScrim.bringToFront();

            // 🌟 核心修复：使用无参的 setTag() 保存标签
            decorView.setTag(statusBarScrim);
        }

        lastInsetHeight = -1;
        updateScrimHeight();

        layoutListener = this::updateScrimHeight;
        decorView.getViewTreeObserver().addOnGlobalLayoutListener(layoutListener);
    }

    private void updateScrimHeight() {
        if (decorView == null || statusBarScrim == null) return;

        int height = getStatusBarInsetHeight();
        if (height <= 0) return;
        if (height == lastInsetHeight) return;

        FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) statusBarScrim.getLayoutParams();
        params.width = FrameLayout.LayoutParams.MATCH_PARENT;
        params.height = height;
        params.gravity = Gravity.TOP;
        statusBarScrim.setLayoutParams(params);
        statusBarScrim.bringToFront();
        lastInsetHeight = height;
    }

    private int getStatusBarInsetHeight() {
        if (Build.VERSION.SDK_INT >= 30 && decorView != null) {
            WindowInsets insets = decorView.getRootWindowInsets();
            if (insets != null) {
                int top = insets.getInsets(WindowInsets.Type.statusBars()).top;
                if (top > 0) return top;
            }
        }

        int resourceId = getActivity().getResources().getIdentifier(
                "status_bar_height", "dimen", "android"
        );
        if (resourceId > 0) {
            return getActivity().getResources().getDimensionPixelSize(resourceId);
        }
        return dp(24);
    }

    private int dp(int value) {
        return Math.round(value * getActivity().getResources().getDisplayMetrics().density);
    }
}