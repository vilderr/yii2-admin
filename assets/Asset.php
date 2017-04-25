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
        'css/admin.css'
    ];

    public $js = [
        'js/admin.js'
    ];

    public $depends = [
        'yii\web\YiiAsset',
        'rmrevin\yii\fontawesome\AssetBundle',
    ];
}