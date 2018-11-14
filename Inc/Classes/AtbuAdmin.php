<?php

namespace Inc\Classes;

use Inc\Classes\AtbuAjax;

class AtbuAdmin
{
    private $ajax;
    public $data;
    public function init()
    {
        $this->ajax = new AtbuAjax();
        add_action('admin_menu', array($this, 'registerSubMenu'));
        add_action('admin_enqueue_scripts', array($this, 'atbuJs'));
        add_action('wp_ajax_atbuExport', array($this->ajax, 'atbuExport'));
        add_action('wp_ajax_atbuImport', array($this->ajax, 'atbuImport'));

        $this->data = json_encode([["id", "guid", "alt"], ["11", "https://atbu-plugin.test/wp-content/uploads/2018/11/arboles.jpg", "Test"], ["10", "https://atbu-plugin.test/wp-content/uploads/2018/11/Arboles-UK-Emergency-Eye-Wash.jpg", "Face"], ["9", "https://atbu-plugin.test/wp-content/uploads/2018/11/Newsletter-Popup-2.jpg", "Discount"], ["8", "https://atbu-plugin.test/wp-content/uploads/2018/11/Newsletter-Popup-2-cropped.jpg", ""], ["7", "https://atbu-plugin.test/wp-content/uploads/2018/11/thank-you.jpg", ""], ["6", "https://atbu-plugin.test/wp-content/uploads/2018/11/Warning.jpg", ""], ["5", "https://atbu-plugin.test/wp-content/uploads/2018/11/nrbzQMa.jpg", ""], [""]]);
    }

    public function registerSubMenu()
    {
        add_submenu_page(
            'tools.php',
            'ATBU Uploader',
            'ATBU Uploader',
            'manage_options',
            'submenu-page',
            array($this, 'subMenuPage')
        );
    }

    public function atbuJs()
    {
        wp_enqueue_style('atbu-css', plugins_url('atbu/build/css/main.min.css', 'atbu', __FILE__));
        wp_register_script('atbu-js', plugins_url('atbu/build/js/app.js', 'atbu', __FILE__), array('jquery'), false, true);
        $security = array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'export_nonce' => wp_create_nonce('5mEjGJt3pvXy5S2oRcSe0SMA'),
            'import_nonce' => wp_create_nonce('bZgwJz7udrKVzxlSO0W6uNYG')
        );
        wp_localize_script('atbu-js', 'wpAjax', $security);
        wp_enqueue_script('atbu-js');
    }

    public function subMenuPage()
    {
        // $this->ajax->atbuImport($this->data);
        // print_r($this->data);
        ?>
        <div class="wrap">
            <div class="section-wrapper">
                <h1>ATBU Options</h1>
                <h2>Export Data</h2>
                <p>Click below to download your exported CSV file:</p>
                <p> (Note: Image url is read only and cannot be edited)</p>
                <div class="atbu-button-wrapper">
                    <a url="#0" type="submit" name="submit" id="download-link" class="button button-primary button-large">
                        Download CSV
                    </a>
                    <div id="export-spinner" class="spinner"></div>
                </div>
            </div>
            <br/>
            <div class="section-wrapper">
                <h2>Import Data</h2>
                <p>Upload your file and click import to import your data</p>
                <p><input type="file" id="user-import-file"/></p>
                <div class="atbu-button-wrapper">
                    <a url="#0" type="submit" name="submit" id="import-link" class="button button-primary button-large">
                        Import CSV
                    </a>
                    <div id="import-spinner" class="spinner"></div>
                </div>
                <div class="results-wrapper" id="import-results"></div>
            </div>
        </div>
        <?php
    }
}