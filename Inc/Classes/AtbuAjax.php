<?php

namespace Inc\Classes;

use Inc\Classes\AtbuExportImport;

class AtbuAjax
{
    private $action;
    private $security;
    public $import;
    public $data;

    public function __construct()
    {
        if (isset($_POST["action"]) &&
            isset($_POST["security"])||
            isset($_POST["importData"])) {
            $this->action = $_POST["action"];
            $this->security = $_POST["security"];
            $this->import = $_POST["importData"];
        }
        if ($this->action == "atbuExport") {
            $this->atbuExport($this->action, $this->security);
        } elseif ($this->action == "atbuImport") {
            $this->atbuImport($this->action, $this->security, $this->import);
        }
    }

    private function atbuExport($action = null, $security = null)
    {
        $response = "Sorry, you don't have permission to do that.";
        // $response = $this->import;
        if (!wp_verify_nonce($security, '5mEjGJt3pvXy5S2oRcSe0SMA')) {
            $response = "No data received, or data was incorrect";
            return wp_send_json_error($response);
            wp_die();
        }
        $this->data = new AtbuExportImport();
        $response = $this->data->exportAtbuData();
        return wp_send_json_success($response);
    }

    public function atbuImport($action = null, $security = null, $data = null)
    // public function atbuImport($data = null)
    {
        $response = "Sorry, you don't have permission to do that.";
        if (!wp_verify_nonce($security, 'bZgwJz7udrKVzxlSO0W6uNYG')) {
            $response = "No data received, or data was incorrect";
            wp_send_json_error($response);
        }

        $this->data = new AtbuExportImport();
        $response = $this->data->importData($data);
        if ($response['status'] === true) {
            wp_send_json_success($response['data']);
        } elseif ($response['status'] === false) {
            wp_send_json_error($response['data']);
        }
    }
}
