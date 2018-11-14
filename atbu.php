<?php
/**
 * @package Akismet
 */
/*
Plugin Name: ATBU
Plugin URI: https://ATBU.com/
Description: ATBU Stuff
Version: 0.1
Author: BH
Author URI: https://somewhere.com/wordpress-plugins/
License: GPLv2 or later
Text Domain: ATBU
 */
use Inc\Classes\AtbuAdmin;

require "autoload.php";

if (!function_exists('add_action')) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit;
}

define('ATBU_VERSION', '0.1');
define('ATBU__PLUGIN_DIR', plugin_dir_path(__FILE__));

if (is_admin()) {
    $atbu = new AtbuAdmin();
    add_action('plugins_loaded', array($atbu, 'init'));
}
