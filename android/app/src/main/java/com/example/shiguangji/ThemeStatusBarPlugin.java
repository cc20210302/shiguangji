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

@CapacitorPlugin(name = "ThemeStatusBar")
public class ThemeStatusBarPlugin extends Plugin {
    private FrameLayout decorView;
    private View statusBarScrim;
    private ViewTreeObserver.OnGlobalLayoutListener layoutListener;
    private int lastInsetHeight = -1;

    // 🌟 修复：用一个固定的 ID 作为 Tag 键，避免 String 转 int 报错
    private static final int SCRIM_TAG_ID = 0x7f000001;

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
                // Android 15+ 强制透明，我们自己在顶层画色块
                window.setStatusBarColor(Color.TRANSPARENT);
                ensureStatusBarScrim(window);
                statusBarScrim.setBackgroundColor(color);
                updateScrimHeight();

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
        if (!(decor instanceof FrameLayout)) return;

        decorView = (FrameLayout) decor;

        // 🌟 使用固定的 int ID 获取标签
        Object existing = decorView.getTag(SCRIM_TAG_ID);
        if (existing instanceof View) {
            statusBarScrim = (View) existing;
        } else {
            statusBarScrim = new View(getActivity());
            // 🌟 设置标签
            statusBarScrim.setTag(SCRIM_TAG_ID, statusBarScrim);

            statusBarScrim.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);
            statusBarScrim.setClickable(false);
            statusBarScrim.setFocusable(false);
            statusBarScrim.setElevation(dp(32)); // 确保层级最高

            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    Math.max(1, getStatusBarInsetHeight()),
                    Gravity.TOP
            );
            decorView.addView(statusBarScrim, params);
            statusBarScrim.bringToFront();

            // 🌟 保存标签
            decorView.setTag(SCRIM_TAG_ID, statusBarScrim);
        }

        lastInsetHeight = -1;
        updateScrimHeight();

        layoutListener = this::updateScrimHeight;
        decorView.getViewTreeObserver().addOnGlobalLayoutListener(layoutListener);
    }

    private void updateScrimHeight() {
        if (decorView == null || statusBarScrim == null) return;

        int height = getStatusBarInsetHeight();
        if (height <= 0 || height == lastInsetHeight) return;

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
        // 兜底：获取系统自带的状态栏高度资源
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