<?php
namespace Inc\Classes;

if (!function_exists('add_action')) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit;
}

use WP_Query;

class AtbuExportImport
{
    public function exportAtbuData()
    {
        $args = array(
            'post_type' => 'attachment',
            'post_mime_type' => 'image',
            'post_status' => 'inherit',
            'posts_per_page' => -1,
        );
        $images = new WP_Query($args);

        $list = array();
        foreach ($images->posts as $post) {
            $list[] = array(
                absint($post->ID),
                esc_url(wp_get_attachment_url($post->ID)),
                sanitize_text_field(get_post_meta($post->ID, '_wp_attachment_image_alt', true))
            );
        }

        return $list;
    }

    public function importData($data = null)
    {
        $formatData = json_decode($data);
        if ($formatData[0][0] != "id" || $formatData[0][2] != "alt") {
            $response = array();
            $response['data'] = "Data is missing column headers, please download the export, make your changes, and try again";
            $response['status'] = false;
            return $response;
        }
        $responseArr = array();
        $responseArr[] = array(
            'id',
            'url',
            'alt'
        );
        foreach ($formatData as $val) {
            $id = filter_var($val[0], FILTER_SANITIZE_STRING);
            if (!empty($val[2])) {
                $alt = filter_var($val[2], FILTER_SANITIZE_STRING);
            }
            if (!empty($id) && !empty($alt) && $id !== 'id' && get_post_meta($id, '_wp_attachment_image_alt', true)) {
                $responseArr[] = $val;
                update_post_meta($id, '_wp_attachment_image_alt', $alt);
            }
        }
        $response = array();
        $response['data'] = $responseArr;
        $response['status'] = true;
        return $response;
    }
}
