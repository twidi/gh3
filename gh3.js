/*
    gh3.js
    Created : 2012.07.25 by k33g

    TODO :
        - Repositories for an organization
        - Search : http://developer.github.com/v3/search/
        - ...

    History :
        - 2012.07.25 : '0.0.1' : first version
        - 2012.07.26 : '0.0.2' : fixes
        - 2012.07.26 : '0.0.3' : gists pagination
        - 2012.07.28 : '0.0.4' :
            * refactoring : Gh3.Helper
            * gists filtering
            * gist comments filtering
            * file commits filtering
            * commits sorting
            * new Type : Gh3.Repositories (with pagination)
        - 2012.07.29 : '0.0.5' :
            * Gh3.Repositories : add search ability
            * add Gh3.Users : search user ability
        - 2012.07.29 : '0.0.6' :
            * async.js compliant
        - 2012.08.02 : '0.0.7' :
            * Node compliant for the future ... becareful to dependencies
*/

(function () {

    //var Gh3 = this.Gh3 = {}
    var root = this
    ,    Gh3
    ,    Kind
    ,    Collection
    ,    ItemContent
    ,    SingleObject
    ,    Fetchable
    ,    ReadmeFetcher
    ,    Base64;

    if (typeof exports !== 'undefined') {
        Gh3 = exports;
    } else {
        Gh3 = root.Gh3 = {};
    }

    Gh3.VERSION = '0.0.7'; //2012.08.02

    //Object Model Tools (helpers) like Backbone
    Kind = function(){};

    Kind.inherits = function (parent, protoProps, staticProps) {
        var child
            , ctor = function(){}
            , merge = function (destination, source) {
                for (var prop in source) {
                    destination[prop] = source[prop];
                }
        };
        //constructor ....
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ parent.apply(this, arguments); };
        }

        //inherits from parent
        merge(child, parent);

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        //instance properties
        if(protoProps) { merge(child.prototype, protoProps); }

        //static properties
        if(staticProps) { merge(child, staticProps); }

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = parent.prototype;

        return child;

    };
    Kind.extend = function (protoProps, staticProps) {
        var child = Kind.inherits(this, protoProps, staticProps);
        child.extend = this.extend;
        return child;
    };


    if (!root.Base64) {
        Base64 = { //http://www.webtoolkit.info/javascript-base64.html

            // private property
            _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

            // public method for decoding
            decode : function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                while (i < input.length) {

                    enc1 = this._keyStr.indexOf(input.charAt(i++));
                    enc2 = this._keyStr.indexOf(input.charAt(i++));
                    enc3 = this._keyStr.indexOf(input.charAt(i++));
                    enc4 = this._keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                }

                output = Base64._utf8_decode(output);

                return output;

            },

            encode : function (input) {
                    var output = "";
                    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                    var i = 0;

                    input = Base64._utf8_encode(input);

                    while (i < input.length) {

                            chr1 = input.charCodeAt(i++);
                            chr2 = input.charCodeAt(i++);
                            chr3 = input.charCodeAt(i++);

                            enc1 = chr1 >> 2;
                            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                            enc4 = chr3 & 63;

                            if (isNaN(chr2)) {
                                    enc3 = enc4 = 64;
                            } else if (isNaN(chr3)) {
                                    enc4 = 64;
                            }

                            output = output +
                            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

                    }

                    return output;
            },

            // private method for UTF-8 decoding
            _utf8_decode : function (utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;

                while ( i < utftext.length ) {

                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    }
                    else if((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i+1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    }
                    else {
                        c2 = utftext.charCodeAt(i+1);
                        c3 = utftext.charCodeAt(i+2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }

                }

                return string;
            },

            // private method for UTF-8 encoding
            _utf8_encode : function (string) {
                    string = string.replace(/\r\n/g,"\n");
                    var utftext = "";

                    for (var n = 0; n < string.length; n++) {

                            var c = string.charCodeAt(n);

                            if (c < 128) {
                                    utftext += String.fromCharCode(c);
                            }
                            else if((c > 127) && (c < 2048)) {
                                    utftext += String.fromCharCode((c >> 6) | 192);
                                    utftext += String.fromCharCode((c & 63) | 128);
                            }
                            else {
                                    utftext += String.fromCharCode((c >> 12) | 224);
                                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                                    utftext += String.fromCharCode((c & 63) | 128);
                            }

                    }

                    return utftext;
            }

        };

        root.Base64 = Base64;
    }

    Gh3.Base64 = root.Base64;

    if (window.XDomainReques) {
        try {
            new XDomainRequest();
            $.support.cors = true;
            $.ajaxSetup.xhr = function() { return new XDomainRequest(); };
        } catch (e) {}
    }

    Gh3.Helper = Kind.extend({

    },{
        protocol : "https",
        domain : "api.github.com",
        headers: {
            Origin: location.host,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        cache: true,
        callHttpApi : function (apiParams) {
            apiParams.url = Gh3.Helper.protocol + "://" + Gh3.Helper.domain + "/" + apiParams.service;
            if ($.support.cors) {
                apiParams.headers = $.extend({}, Gh3.Helper.headers, apiParams.headers || {});
                if (!apiParams.dataType) { apiParams.dataType = Gh3.Helper.dataType; }
                if (!apiParams.cache && apiParams.cache !== false) { apiParams.cache = Gh3.Helper.cache; }
                var success = apiParams.success;
                if ($.isFunction(success)) {
                    apiParams.success = function (data, textStatus, jqXHR) {
                        success.call(this, {data: data}, textStatus, jqXHR);
                    };
                }
            } else {
                //delete apiParams.service;
                apiParams.dataType = 'jsonp';
            }

            $.ajax(apiParams);
        }
    });


    /* Base objects */

    Fetchable = Kind.extend({
        constructor: function () {
            this.fetched = false;
        },
        _setData: function(data) {
            for(var prop in data) {
                this[prop] = data[prop];
            }
        },
        _onFetchSuccess: function(callback, result) {
            this.fetched = true;
            if (callback) { callback(null, this); }
        },
        _onFetchError: function(callback, error) {
            if (callback) { callback(new Error(error)); }
        },
        _service: function() {
            throw('Undefined service');
        },
        _defaultFetchCallParams: function() {
            return {};
        },
        _preFetch: function(callback, querystring_args) {
        },
        fetch: function(callback, querystring_args) {
            var that = this,
                default_params, call_params, call_args;

            that._preFetch(callback, querystring_args);

            call_params = {
                service : that._service(),
                success : function(res) {
                    that._onFetchSuccess(callback, res);
                },
                error : function (res) {
                    that._onFetchError(callback, res);
                }
            };

            default_params = that._defaultFetchCallParams();

            if (querystring_args) {
                default_params.data = $.extend({}, default_params.data || {}, querystring_args);
            }

            Gh3.Helper.callHttpApi($.extend({}, default_params, call_params));
        }
    });

    SingleObject = Fetchable.extend({
        constructor : function (data) {
            SingleObject.__super__.constructor.call(this);
            this._setData(data);
        },
        _onFetchSuccess: function(callback, result) {
            this._setData(result.data);
            SingleObject.__super__._onFetchSuccess.call(this, callback, result);
        }
    });

    Collection = {};

    Collection._Base = Fetchable.extend({
        constructor: function (parent) {
            this.parent = parent;
            this.reset();
        },
        reset: function() {
            this.list = [];
            this.fetched = false;
        },
        length: function() {
            return this.list.length;
        },
        reverse: function () {
            this.list.reverse();
        },
        sort: function(comparison_func) {
            if (comparison_func) {
                this.list.sort(comparison_func);
            } else {
                this.list.sort();
            }
        },
        getAll: function() {
            return this.list;
        },
        filterBy: function(field, value) {
            return _.filter(this.list, function(item) {
                return item[field] == value;
            }, this);
        },
        getBy: function(field, value) {
            return _.find(this.list, function(item) {
                return item[field] == value;
            }, this);
        },
        getByName: function(name) {
            return this.getBy('name', name);
        },
        each: function(callback) {
            _.each(this.list, function (item) {
                callback(item);
            });
        },
        _onFetchSuccess: function(callback, result) {
            this.fetched = true;
            this._setItems(result.data);
            if (callback) { callback(null, this.parent); }
        },
        _prepareItem: function(item) {
            return item;
        },
        _addItem: function(item) {
            this.list.push(this._prepareItem(item));
        },
        _addItems: function(items) {
            var that = this;
            _.each(items, function (item) {
                that._addItem(item);
            });
        },
        _setItems: function(items) {
            this.list = [];
            this._addItems(items);
        }

    });


    /* Users */

    Gh3.User = SingleObject.extend({
        constructor : function (login, user_infos) {

            if (login) {
                this.login = login;
            } else {
                throw "login !";
            }

            Gh3.User.__super__.constructor.call(this, user_infos);

            this.repositories = new Collection.UserRepositories(this);
            this.members = new Collection.OrganizationMembers(this);
            this.orgs = new Collection.UserOrganizations(this);
            this.followers = new Collection.UserFollowers(this);
            this.following = new Collection.UserFollowing(this);
            this.starred = new Collection.UserStarredRepositories(this);
            this.events = new Collection.UserEvents(this);
            this.received_events = new Collection.UserReceivedEvents(this);
            this.gists = new Collection.UserGists(this);
        },
        _service: function() {
            return "users/" + this.login;
        }
    });
    Collection._UsersList = Collection._Base.extend({
        _prepareItem: function(item) {
            return new Gh3.User(item.login, item);
        },
        getByLogin: function(login) {
            return this.getBy('login', login);
        }
    });

    Collection.OrganizationMembers = Collection._UsersList.extend({
        _service: function() { return "orgs/" + this.parent.login + "/members"; }
    });
    Collection.UserOrganizations = Collection._UsersList.extend({
        _service: function() { return this.parent._service() + "/orgs"; }
    });
    Collection.UserFollowers = Collection._UsersList.extend({
        _service: function() { return this.parent._service() + "/followers"; }
    });
    Collection.UserFollowing = Collection._UsersList.extend({
        _service: function() { return this.parent._service() + "/following"; }
    });
    Collection.RepositoryContributors = Collection._UsersList.extend({
        _service: function() { return this.parent._service() + "/contributors"; }
    });
    Collection.RepositoryStargazers = Collection._UsersList.extend({
        _service: function() { return this.parent._service() + "/stargazers"; }
    });


    /*Events*/

    Gh3.Event = SingleObject.extend({
        // TODO: manage actor as Gh3.User, repo as Gh3.repository
    });
    Collection._EventsList = Collection._Base.extend({
        _prepareItem: function(item) {
            return new Gh3.Event(item);
        }
    });
    Collection.UserEvents = Collection._EventsList.extend({
        _service: function() { return this.parent._service() + "/events"; }
    });
    Collection.UserReceivedEvents = Collection._EventsList.extend({
        _service: function() { return this.parent._service() + "/received_events"; }
    });
    Collection.RepositoryEvents = Collection._EventsList.extend({
        _service: function() { return this.parent._service() + "/events"; }
    });


    /* Gists */

    Gh3.Gist = SingleObject.extend({
        constructor : function (gistData) {
            this.files = new Collection.GistFiles(this);
            this.comments = new Collection.GistComments(this);

            Gh3.Gist.__super__.constructor.call(this, gistData);
        },
        _setData: function(data) {
            var files = data.files;
            delete data.files;

            data.comment_count = data.comments;
            delete data.comments;

            Gh3.Gist.__super__._setData.call(this, data);

            this.files._setItems(files);
        },
        _service: function() {
            return "gists/" + this.id;
        }
    });

    Gh3.GistComment = SingleObject.extend({
    });

    Collection.GistComments = Collection._Base.extend({
        _prepareItem: function(item) {
            return new Gh3.GistComment(item);
        },
        _service: function() {
            return this.parent._service() + "/comments";
        }
    });

    Collection.UserGists = Collection._Base.extend({
        _prepareItem: function(item) {
            return new Gh3.Gist(item);
        },
        _service: function() {
            return this.parent._service() + "/gists";
        }
    });

    Gh3.GistFile = SingleObject.extend({
    });

    Collection.GistFiles = Collection._Base.extend({
        _prepareItem: function(item) {
            return new Gh3.GistFile(item);
        },
        getByName: function(name) {
            return this.getBy('filename', name);
        }
    });


    /* ItemContents: files and dirs */

    ItemContent = SingleObject.extend({
        constructor : function (contentItem, ghBranch) {
            this.branch = ghBranch;
            ItemContent.__super__.constructor.call(this, contentItem);
        },
        _service: function() {
            return this.branch.repository._service() + "/contents/" + this.path;
        }
    });

    Gh3.File = ItemContent.extend({
        constructor : function (contentItem, ghBranch) {
            Gh3.File.__super__.constructor.call(this, contentItem, ghBranch);
            this.commits = new Collection.FileCommits(this);
        },
        _service: function() {
            return this.branch.repository._service() + "/contents/" + this.path;
        },
        _defaultFetchCallParams: function() {
            var params = Collection.ItemContents.__super__._defaultFetchCallParams.call(this);
            params.data = $.extend({}, params.data || {}, {
                ref: this.branch.name
            });
            return params;
        },
        _onFetchSuccess: function(callback, result) {
            if (result.data.content) {
                result.data.content = Base64.decode(result.data.content);
            }
            Gh3.File.__super__._onFetchSuccess.call(this, callback, result);
        }
    });

    Gh3.Dir = ItemContent.extend({
        constructor : function (contentItem, ghBranch) {
            Gh3.Dir.__super__.constructor.call(this, contentItem, ghBranch);
            this.contents = new Collection.ItemContents(this);
        }
    });

    Collection.ItemContents = Collection._Base.extend({
        _prepareItem: function(item) {
            return new Gh3[item.type == "file" ? 'File' : 'Dir'](item, this.parent);
        },
        _service: function() {
            return this.parent.branch.repository._service() + "/contents/" + this.parent.path;
        },
        _defaultFetchCallParams: function() {
            var params = Collection.ItemContents.__super__._defaultFetchCallParams.call(this);
            params.data = $.extend({}, params.data || {}, {
                ref: this.parent.branch.name
            });
            return params;
        },
        files : function (comparator) {
            return _.filter(this.list, function(item) {
                return item.type == "file";
            }, this);
        },
        dirs : function (comparator) {
            return _.filter(this.list, function(item) {
                return item.type == "dir";
            }, this);
        },
        getFileByName : function (name) {
            return _.find(this.list, function (item) {
                return item.name == name && item.type == "file";
            });
        },
        getDirByName : function (name) {
            return _.find(this.list, function (item) {
                return item.name == name && item.type == "dir";
            });
        }
    });


    /* Commits */

    Gh3.Commit = SingleObject.extend({
        constructor : function (commitInfos, ghBranch) {
            this.branch = ghBranch;
            this.files = new Collection.CommitFiles(this);
            Gh3.Commit.__super__.constructor.call(this, commitInfos);
        },
        _setData: function(data) {
            var author = data.authors,
                commiter = data.commiter,
                files = data.files;
            if (author) {
                this.author = new Gh3.User(author.login, author);
                delete data.authors;
            }
            if (commiter) {
                if (commiter.login != author.login) {
                    this.commiter = new Gh3.User(commiter.login, commiter);
                } else {
                    this.commiter = this.author;
                }
                delete data.commiter;
            }
            if (files) {
                this.files._setItems(files);
                delete data.files;
            }
            Gh3.Commit.__super__._setData.call(this, data);
        }
    },{});

    Gh3.CommitFile = SingleObject.extend({
        constructor: function(commitFileData, ghCommit) {
            this.commit = ghCommit;
            Gh3.CommitFile.__super__.constructor.call(this, commitFileData);
        },
        _setData: function(data, ghCommit) {
            this.commit = ghCommit;
            this.file = new Gh3.File({
                sha: data.sha,
                filename: data.filename
            }, this.commit.branch);
            Gh3.CommitFile.__super__._setData.call(this, data);
        }
    });

    Collection.CommitFiles = Collection._Base.extend({
        _prepareItem: function(item) {
            return new Gh3.CommitFile(item, this.parent);
        },
        getByName: function(name) {
            return this.getBy('filename', name);
        }
    });

    Collection._Commits = Collection._Base.extend({
        _service: function() {
            return this.parent.branch.repository._service() + "/commits";
        },
        _prepareItem: function(item) {
            return new Gh3.Commit(item, this.parent.branch);
        },
        last: function() {
            return this.list[0];
        },
        first: function() {
            return this.list[this.list.length-1];
        }
    });

    Collection.FileCommits = Collection._Commits.extend({
        _defaultFetchCallParams: function(callback, querystring_args) {
            var params = Collection.FileCommits.__super__._defaultFetchCallParams.call(this, callback, querystring_args);
            params.data = $.extend({}, params.data || {}, {
                path: this.parent.path
            });
            return params;
        }
    });


    Collection.BranchCommits = Collection._Commits.extend({
        _defaultFetchCallParams: function(callback, querystring_args) {
            var params = Collection.FileCommits._defaultFetchCallParams.call(this, callback, querystring_args);
            params.data = $.extend({}, params.data || {}, {
                ref: this.parent.name
            });
            return params;
        }
    });


    /* Branches */

    Gh3.Branch = SingleObject.extend({
        constructor: function(branchData, ghRepository) {
            this.repository = ghRepository;
            this.branch = this;  // used for contents
            this.path = '';  // used for contents
            Gh3.Branch.__super__.constructor.call(this, branchData);
            this.contents = new Collection.ItemContents(this);

        },
        _service: function() {
            return this.parent._service() + "/branches/" + this.name;

        },
        _setData: function(data) {
            if (data.commit) {
                this.head_commit = new Gh3.Commit(data.commit, this);
                delete data.commit;
            }
            Gh3.Branch.__super__._setData.call(this, data);
        }
    });

    Collection.RepositoryBranches = Collection._Base.extend({
        _service: function() {
            return this.parent._service() + "/branches";
        },
        _prepareItem: function(item) {
            return new Gh3.Branch(item, this.parent);
        }
    });


    /* Repositories */

    Gh3.Repository = SingleObject.extend({
        constructor : function (name, ghUser, infos) {

            if (name && ghUser) {
                this.name = name;
                this.user = ghUser;
            } else {
                throw "name && user !";
            }

            Gh3.Gist.__super__.constructor.call(this, infos);

            this.readme = '';
            this.readmeFetcher = new ReadmeFetcher(this);

            this.contributors = new Collection.RepositoryContributors(this);
            this.forks = new Collection.RepositoryForks(this);
            this.stargazers = new Collection.RepositoryStargazers(this);
            this.events = new Collection.RepositoryEvents(this);
            this.branches = new Collection.RepositoryBranches(this);

        },
        _service: function() {
            return "repos/" + this.user.login + "/" + this.name;
        },
        fetchReadme: function (callback, querystring_args) {
            this.readmeFetcher.fetch(callback, querystring_args);
        }

    });

    ReadmeFetcher = Fetchable.extend({
        constructor: function(ghRepo) {
            this.repository = ghRepo;
            ReadmeFetcher.__super__.constructor.call(this);
        },
        _service: function() {
            return this.repository._service() + "/readme";
        },
        _onFetchSuccess: function(callback, result) {
            this.repository.readme = result.data;
            this.fetched = true;
            if (callback) { callback(null, this.repository); }
        },
        _defaultFetchCallParams: function() {
            var params = ReadmeFetcher.__super__._defaultFetchCallParams.call(this);
            params.dataType = 'html';
            params.headers = $.extend({}, params.headers || {}, {
                Accept: 'application/vnd.github.html+json',
                'Content-Type': 'text/html'
            });
            return params;
        }
    });

    Collection._RepositoriesList = Collection._Base.extend({
        _prepareItem: function(item) {
            var owner = new Gh3.User(item.owner.login, item.owner);
            return new Gh3.Repository(item.name, owner, item);
        }
    });
    Collection.UserRepositories = Collection._RepositoriesList.extend({
        _service: function() { return this.parent._service() + "/repos"; }
    });
    Collection.UserStarredRepositories = Collection._RepositoriesList.extend({
        _service: function() { return this.parent._service() + "/starred"; }
    });
    Collection.RepositoryForks = Collection._RepositoriesList.extend({
        _service: function() { return this.parent._service() + "/forks"; }
    });









    //TODO: Repositories for an organization

    Gh3.Repositories = Kind.extend({//http://developer.github.com/v3/repos/

    },{//static members
        repositories : [],
        search : function (keyword, pagesInfo, callback) {
            Gh3.Repositories.repositories = [];
            Gh3.Helper.callHttpApi({
                service : "legacy/repos/search/"+keyword,
                data : pagesInfo,
                //beforeSend: function (xhr) { xhr.setRequestHeader ("rel", paginationInfo); },
                success : function(res) {
                    //console.log("*** : ", res);
                    _.each(res.data.repositories, function (repository) {
                        Gh3.Repositories.repositories.push(new Gh3.Repository(repository.name, new Gh3.User(repository.owner), repository));
                        //owner & login : same thing ???
                    });

                    if (callback) { callback(null, Gh3.Repositories); }
                },
                error : function (res) {
                    if (callback) { callback(new Error(res)); }
                }
            });

        },
        reverse : function () {
            Gh3.Repositories.repositories.reverse();
        },
        sort : function (comparison_func) {
            if (comparison_func) {
                Gh3.Repositories.repositories.sort(comparison_func);
            } else {
                Gh3.Repositories.repositories.sort();
            }
        },
        getAll : function() { return Gh3.Repositories.repositories; },
        getByName : function (name) {
            return _.find(Gh3.Repositories.repositories, function (item) {
                return item.name == name;
            });
        },
        each : function (callback) {
            _.each(Gh3.Repositories.repositories, function (repository) {
                callback(repository);
            });
        },
        filter : function (comparator) {
            return _.filter(Gh3.Repositories.repositories, comparator);
        }
    });
    Gh3.Users = Kind.extend({

    },{//static members
        users : [],
        search : function (keyword, pagesInfo, callback) {
            Gh3.Users.users = [];
            Gh3.Helper.callHttpApi({
                service : "legacy/user/search/"+keyword,
                data : pagesInfo,
                //beforeSend: function (xhr) { xhr.setRequestHeader ("rel", paginationInfo); },
                success : function(res) {
                    _.each(res.data.users, function (user) {
                        Gh3.Users.users.push(new Gh3.User(user.login, user));
                    });

                    if (callback) { callback(null, Gh3.Users); }
                },
                error : function (res) {
                    if (callback) { callback(new Error(res)); }
                }
            });

        },
        reverse : function () {
            Gh3.Users.users.reverse();
        },
        sort : function (comparison_func) {
            if (comparison_func) {
                Gh3.Users.users.sort(comparison_func);
            } else {
                Gh3.Users.users.sort();
            }
        },
        getAll : function() { return Gh3.Users.users; },
        getByName : function (name) {
            return _.find(Gh3.Users.users, function (item) {
                return item.name == name;
            });
        },
        getByLogin : function (login) {
            return _.find(Gh3.Users.users, function (item) {
                return item.login == login;
            });
        },
        each : function (callback) {
            _.each(Gh3.Users.users, function (user) {
                callback(user);
            });
        },
        filter : function (comparator) {
            return _.filter(Gh3.Users.users, comparator);
        }

    });



}).call(this);
