# pull-list

A command line utility to keep track of recently released comics.

## Setup
You'll need to set the environment variable COMICVINE_API_KEY 
which you can get at http://www.comicvine.com/api/

## Usage
pull-list takes a text file listing the comics to look up.

``` bash
pull-list filename
```
## Output

``` bash
Issues this week
--------------------------------------------
Uncanny X-Men came out 4 days ago
Hawkeye came out 4 days ago
East of West came out 4 days ago
The Walking Dead came out 4 days ago
Batman came out 4 days ago

Old issues
--------------------------------------------
Saga came out 95 days ago
Iron Man came out 11 days ago
The Manhattan Projects came out 32 days ago
American Vampire came out 193 days ago
```

## Pull list file format
The current file format depends on you knowing the Comicvine ID for the volume
you're looking up. The ID is in the url on comicvine.com, eg:
http://www.comicvine.com/saga/4050-46568/

Sample file: pull-list.txt
```
4050-50941: Hawkeye
4050-46568: Saga
4050-57181: Uncanny X-Men
4050-42721: Batman
4050-59366: East of West
4050-18166: Walking Dead
4050-53725: Iron Man
4050-46365: Manhattan Projects
4050-32051: American Vampire
```


