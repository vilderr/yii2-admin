<?php
/**
 * Created by PhpStorm.
 * User: vilderr
 * Date: 25.04.17
 * Time: 10:49
 */

namespace vilderr\admin\assets;


use yii\web\AssetBundle;

class Asset extends AssetBundle
{
    public $sourcePath = '@vendor/vilderr/yii2-admin/dist';

    public $css = [
        'css/admin.css',
        'css/skins/default.css',
    ];

    public $js = [
        'js/admin.js',
        'plugins/slimscroll/jquery.slimscroll.min.js',
    ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapPluginAsset',
        'rmrevin\yii\fontawesome\AssetBundle',
    ];

    public $publishOptions = [
        'forceCopy' => true,
    ];
}