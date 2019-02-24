## Scalabel Usage Documentation and Labeling Instructions

**Note** 
- All the images and videos should go to media/ folder
- media files should be organized as sub folders following the structure of rst files, such as `media/docs/login` and `media/instructions/drivable`.


### Build

Install dependency

```
pip install sphinx sphinx_rtd_theme
```

Build the documentation

```
./build.sh
```

The full doc files will be in `_doc`.

The master will be synced with [scalabel.ai/doc](https://www.scalabel.ai/doc) when a PR is merged.
