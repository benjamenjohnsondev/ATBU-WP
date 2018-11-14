<?php

function atbuAutoloader($className)
{
    $dirSep = DIRECTORY_SEPARATOR;
    $dir = __DIR__;
    $className = str_replace('\\', $dirSep, $className);

    $file = "{$dir}{$dirSep}{$className}.php";
    if (file_exists($file)) {
        include $file;
    }
}

spl_autoload_register('atbuAutoloader');
