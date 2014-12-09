// http://stackoverflow.com/questions/18966485/copy-all-files-from-directory-to-another-with-grunt-js-copy/24690371#24690371
I would like to add that changing the format of the glob in src will modify how the copy works.

As pointed out by bmoeskau above, the following will copy everything inside dist/ and move it to path/to/dir (overwriting the destination if it already exists).

copy: {
  files: {
    expand: true,
    dest: 'path/to/dir',
    cwd: 'dist/',
    src: '**'
  }
}
Note however, that:

copy: {
  files: {
    expand: true,
    dest: 'path/to/dir',
    cwd: 'dist/',
    src: '*'
  }
}
Will only copy files inside dist/ as well as directories, but will not copy the contents of those directories to the destination.

Also, the following with src: '*/*' will only copy directories with contents inside dist/. That is, files just inside dist/ will not be copied.

copy: {
  files: {
    expand: true,
    dest: 'path/to/dir',
    cwd: 'dist/',
    src: '*/*'
  }
}
Finally, same as above, but src: '**/**' will copy only files inside dist/ as well as files inside dist/ subdirectories to path/to/dir. So there will be no folders inside the destination.

copy: {
  files: {
    expand: true,
    dest: 'path/to/dir',
    cwd: 'dist/',
    src: '*/*',
    flatten: true,
    filter: 'isFile'
  }
}
