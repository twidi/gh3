
/*-----------------------------
    User
-----------------------------*/

describe("Instanciate a gitHub user", function () {
    it("His login is k33g", function() {
        expect(
            (new  Gh3.User("k33g")).login
        ).toEqual("k33g");
    });

    it("His login is not bob", function() {
        expect(
            (new  Gh3.User("k33g")).login
        ).not.toEqual("bob");
    });
});

describe("Fetch data of a gitHub user : k33g", function () {
    var k33g = new  Gh3.User("k33g")
    ,    publicRepositories = 0;

    it("should have more than 10 public repositories", function () {
        runs(function () {

            k33g.fetch(function (err, resUser){
                if(err) { throw "outch ..."; }
                publicRepositories = resUser.public_repos;
            });

        }, "asynchronous method : fetch()");

        waitsFor(function () {
            return publicRepositories > 10;
        }, "...", 1000);

        runs(function () {
            expect(publicRepositories).toBeGreaterThan(10);
        });


    });

});

describe("Fetch orgs and members of a gitHub user/organisation", function() {
    var github = new Gh3.User("github")
    ,   defunkt = new Gh3.User("defunkt");

    it("org github should have more that 10 members", function() {
        runs(function () {

            github.members.fetch(function (err, res){
                if(err) { throw "outch ..."; }
            });

        }, "asynchronous method: members.fetch");

        waitsFor(function () {
            return github.members.fetched;
        }, "...", 1000);

        runs(function() {
            expect(github.members.length()).toBeGreaterThan(20);
        });
    });

    it("user defunkt should have at least one org", function() {
        runs(function () {

            defunkt.orgs.fetch(function (err, res){
                if(err) { throw "outch ..."; }
            });

        }, "asynchronous method: orgs.fetch");

        waitsFor(function () {
            return defunkt.orgs.fetched;
        }, "...", 1000);

        runs(function() {
            expect(defunkt.orgs.length()).toBeGreaterThan(1);
        });
    });

});

describe("Fetch following and followers of a github user", function() {
    var k33g = new Gh3.User("k33g");

    it("should have many followers", function () {

        runs(function () {

            k33g.followers.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
            });

        }, "asynchronous method: followers.fetch");

        waitsFor(function() {
            return k33g.followers.fetched;
        }, "...", 1000);

        runs(function() {
            expect(k33g.followers.length()).toBeGreaterThan(10);
        });

    });

    it("should have many following", function () {

        runs(function () {

            k33g.following.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
            });

        }, "asynchronous method: following.fetch");


        waitsFor(function() {
            return k33g.following.fetched;
        }, "...", 1000);

        runs(function() {
            expect(k33g.following.length()).toBeGreaterThan(10);
        });

    });

});

describe("Fetch starred repositories of a github user", function() {
    var k33g = new Gh3.User("k33g");

    it("should have many starred repositories", function () {

        runs(function () {

            k33g.starred.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
            });

        }, "asynchronous method: starred.fetch");


        waitsFor(function() {
            return k33g.starred.fetched;
        }, "...", 1000);

        runs(function() {
            expect(k33g.starred.length()).toBeGreaterThan(10);
        });

    });

});

describe("Fetch events emited and received by github user", function() {
    var k33g = new Gh3.User("k33g");

    it("should have emited many events", function () {

        runs(function () {

            k33g.events.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
            });

        }, "asynchronous method: events.fetch");


        waitsFor(function() {
            return k33g.events.fetched;
        }, "...", 1000);

        runs(function() {
            expect(k33g.events.length()).toBeGreaterThan(10);
        });

    });

    it("should have received many events", function () {

        runs(function () {

            k33g.received_events.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
            });

        }, "asynchronous method: received_events.fetch");


        waitsFor(function() {
            return k33g.received_events.fetched;
        }, "...", 1000);

        runs(function() {
            expect(k33g.received_events.length()).toBeGreaterThan(10);
        });

    });

});

/*-----------------------------
    Users
-----------------------------*/

describe("Search users by keyword mad", function() {
    var user_search = new Gh3.User.Search();

    it("should be more than 10 on first page", function () {

        var numberOfUsers = 0;

        runs(function () {
            user_search.search("mad", function (err, response) {
                if(err) { throw "outch ..."; }
                response.each(function (user) {
                    // console.log(user.name, user.login, user.repos, user);
                    numberOfUsers ++;
                });

            }, {start_page : 1});
        }, "asynchronous method : search()");

        waitsFor(function () {
            return numberOfUsers > 10;
        }, "...", 3000);

        runs(function () {
            expect(numberOfUsers).toBeGreaterThan(10);
        });
    });

    it("should be more than 10 on third page", function () {

        var numberOfUsers = 0;

        runs(function () {
            user_search.fetch(function (err, response) {
                if(err) { throw "outch ..."; }
                response.each(function (user) {
                    numberOfUsers ++;
                });

            }, {start_page : 3});
        }, "asynchronous method : search()");

        waitsFor(function () {
            return numberOfUsers > 10;
        }, "...", 3000);

        runs(function () {
            expect(numberOfUsers).toBeGreaterThan(10);
        });
    });


    /*it("should exist more than 10 users", function () {
        runs(function () {

        });

        waits(function () {

        }, "...", 1000);

        runs(function () {

        });
    });*/



});

/*-----------------------------
    Repositories
-----------------------------*/

describe("Fetch data of repositories of a gitHub user : k33g", function () {
    var k33g = new  Gh3.User("k33g");

    it("should have more than 20 public repositories", function () {
        runs(function () {

            k33g.repositories.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
            }, {page:1, per_page:100, direction : "desc"});

        }, "asynchronous method : repositories.fetch");

        waitsFor(function () {
            return k33g.repositories.fetched;
        }, "...", 1000);

        runs(function () {
            expect(k33g.repositories.length()).toBeGreaterThan(20);
        });

    });

});

describe("Search public repositories by keyword : pdf", function () {
    var repo_search = new Gh3.Repository.Search()
    ,   numberOfFoundRepositories = 0;

    it("should find more than 30 public repositories on page 2", function () {


        runs(function () {

            repo_search.search("pdf", function (err, res) {
                if(err) { throw "outch ..."; }

                repo_search.each(function (repository) {
                    numberOfFoundRepositories ++;
                });

                console.log(numberOfFoundRepositories);
            }, {start_page : 2});


        }, "asynchronous method : search()");

        waitsFor(function () {
            return numberOfFoundRepositories > 30;
        }, "...", 3000);

        runs(function () {
            expect(numberOfFoundRepositories).toBeGreaterThan(30);
        });

    });

});



/*-----------------------------
    Repository
-----------------------------*/

describe("get k33g.github.com repository", function () {

    var k33g = new  Gh3.User("k33g")
    ,    k33gBlog = new Gh3.Repository("k33g.github.com", k33g);

    it("should have clone url = 'https://github.com/k33g/k33g.github.com.git'", function () {

        runs(function () {

            k33gBlog.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
                console.log(k33gBlog);
            });


        }, "asynchronous method : fetch()");

        waitsFor(function () {
            return k33gBlog.clone_url ==  "https://github.com/k33g/k33g.github.com.git";
        }, "...", 1000);

        runs(function () {
            expect(k33gBlog.clone_url).toEqual("https://github.com/k33g/k33g.github.com.git");
        });

    });

});

describe("get gh3 readme", function() {

    var k33g = new Gh3.User("k33g")
    ,   gh3Repo = new Gh3.Repository("gh3", k33g);

    it("should have a readme containing 'wrapper for GitHub'", function () {

        runs(function () {

            gh3Repo.fetchReadme(function (err, res) {
                if(err) { throw "outch ..."; }
                console.log(gh3Repo);
            });

        }, "asynchronous method : fetchReadme()");

        waitsFor(function () {
            return gh3Repo.readme.length > 0;
        }, "...", 1000);

        runs(function () {
            expect(gh3Repo.readme).toContain('wrapper for GitHub');
        });

    });

});

describe("get gh3 contributors", function() {

    var k33g = new Gh3.User("k33g")
    ,   gh3Repo = new Gh3.Repository("gh3", k33g);

    it("should have some contributors, including k33g, with number of contributions", function () {

        runs(function () {

            gh3Repo.contributors.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
            });

        }, "asynchronous method : contributors.fetch()");

        waitsFor(function () {
            return gh3Repo.contributors.fetched;
        }, "...", 1000);

        runs(function () {
            var k33g_ = gh3Repo.contributors.getByLogin('k33g');
            expect(gh3Repo.contributors.length()).toBeGreaterThan(1);
            expect(k33g_.login).toEqual('k33g');
            expect(k33g_.contributions).toBeGreaterThan(20);
        });

    });

});

describe("get gh3 forks", function() {

    var k33g = new Gh3.User("k33g")
    ,   gh3Repo = new Gh3.Repository("gh3", k33g);

    it("should have some forks", function () {

        runs(function () {

            gh3Repo.forks.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
                console.log(gh3Repo);
            });

        }, "asynchronous method : forks.fetch()");

        waitsFor(function () {
            return gh3Repo.forks.fetched;
        }, "...", 1000);

        runs(function () {
            expect(gh3Repo.forks.length()).toBeGreaterThan(0);
        });

    });

});

describe("get gh3 stargazers", function() {

    var k33g = new Gh3.User("k33g")
    ,   gh3Repo = new Gh3.Repository("gh3", k33g);

    it("should have some stargazers", function () {

        runs(function () {

            gh3Repo.stargazers.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
                console.log(gh3Repo);
            });

        }, "asynchronous method : stargazers.fetch()");

        waitsFor(function () {
            return gh3Repo.stargazers.fetched;
        }, "...", 1000);

        runs(function () {
            expect(gh3Repo.stargazers.length()).toBeGreaterThan(10);
        });

    });

});

describe("Fetch events related to a repository", function() {
    var k33g = new Gh3.User("k33g")
    ,   gh3Repo = new Gh3.Repository("gh3", k33g);

    it("should have many events", function () {

        runs(function () {

            gh3Repo.events.fetch(function (err, res) {
                if(err) { throw "outch ..."; }
            });

        }, "asynchronous method: events.fetch");


        waitsFor(function() {
            return gh3Repo.events.fetched;
        }, "...", 1000);

        runs(function() {
            expect(gh3Repo.events.length()).toBeGreaterThan(10);
        });

    });

});


/*-----------------------------
    Branch, File & Directory
-----------------------------*/

//nested describe with previous describe would be better
describe("get master branch of k33g.github.com repository", function () {

    var k33g = new Gh3.User("k33g")
    ,    k33gBlog = new Gh3.Repository("k33g.github.com", k33g)
    ,    numberOfContents = 0
    ,    master;

    it("should have several contents", function () {

        runs(function () {

            k33gBlog.fetch(function (err, res) {
                if(err) { throw "outch ..."; }

                console.log("k33gBlog : ", k33gBlog);
                k33gBlog.branches.fetch(function (err, res) {
                    if(err) { throw "outch ..."; }

                    master = k33gBlog.branches.getByName("master");

                    console.log("master : ", master);

                    master.contents.fetch(function (err, res) {
                        if(err) { throw "outch ..."; }

                        console.log(master.contents.getAll());
                        numberOfContents = master.contents.length();
                    });

                });
            });

        }, "asynchronous method : contents.fetch()");

        waitsFor(function () {
            return numberOfContents > 0;
        }, "...", 2000);

        runs(function () {
            console.log("numberOfContents : ", numberOfContents);
            expect(numberOfContents).toBeGreaterThan(0);
        });

    });

});


describe("when contents of master branch are fetched", function () {

    var k33g = new Gh3.User("k33g")
    ,    k33gBlog = new Gh3.Repository("k33g.github.com", k33g)
    ,    master
    ,    myfile //= master.getFileByName("index.html")
    ,    dir //= master.getDirByName('_posts');
    ,    rawContent = "";


    it("should have a index.html file with raw content", function () {

        runs(function () {

            k33gBlog.fetch(function (err, res) {
                if(err) { throw "outch ..."; }

                k33gBlog.branches.fetch(function (err, res) {
                    if(err) { throw "outch ..."; }

                    master = k33gBlog.branches.getByName("master");

                    master.contents.fetch(function (err, res) {
                        if(err) { throw "outch ..."; }
                        myfile = master.contents.getFileByName("index.html");

                        myfile.fetch(function (err, res) {
                            if(err) { throw "outch ..."; }
                            rawContent = myfile.content;
                        });
                    });

                });
            });

        }, "asynchronous method : contents.fetch()");

        waitsFor(function () {
            return rawContent.length > 0;
        }, "...", 2000);

        runs(function () {
            console.log("rawContent : ", rawContent);
            expect(rawContent.length).toBeGreaterThan(0);
        });

    });

    it("should have a index.html file with commits", function () {
        var numberOfCommits = 0;

        runs(function () {
            myfile.commits.fetch(function (err, res) {
                if(err) { throw "outch ..."; }

                console.log(myfile.commits.getAll());

                myfile.commits.each(function (commit) {
                    console.log(commit.author.login, commit.message, commit.date);
                    numberOfCommits ++;
                });
            });
        }, "asynchronous method : commits.fetch()");

        waitsFor(function () {
            return numberOfCommits > 0;
        }, "...", 2000);

        runs(function () {
            expect(numberOfCommits).toBeGreaterThan(0);
        });

    });

    it("should have a _post diretory with contents", function () {
        var numberOfContentsInDirectory = 0;

        runs(function () {
            dir = master.contents.getDirByName('_posts');

            dir.contents.fetch(function (err, res) {
                if(err) { throw "outch ..."; }

                console.log(dir.contents.getAll());

                dir.contents.each(function (content) {
                    console.log(content.name, content.type, content.size);
                    numberOfContentsInDirectory ++;
                });
            });

        },"asynchronous method : contents.fetch()");

        waitsFor(function () {
            return numberOfContentsInDirectory > 0;
        }, "...", 1000);

        runs(function () {
            expect(numberOfContentsInDirectory).toBeGreaterThan(0);
        });
    });

});

/*-----------------------------
    Gists, Gist
-----------------------------*/

describe("Get some gists of k33g", function () {
    var k33g = new Gh3.User("k33g")
    , numberOfFoundGists = 0;


    it("should have more than 3 gists on page 2", function () {

        runs(function () {
            k33g.gists.fetch(function (err, res) {

                if(err) { throw "outch ..."; }

                console.log(k33g.gists.getAll());

                k33g.gists.each(function (gist) {
                    //console.log(gist.description, gist.id);
                    numberOfFoundGists ++;
                });
            }, {page:2, per_page:5});

        },"asynchronous method : fetch()");

        waitsFor(function () {
            return numberOfFoundGists > 3;
        }, "...", 1000);

        runs(function () {
            expect(numberOfFoundGists).toBeGreaterThan(3);
        });

    });

});

describe("Get gist where id = 1096826", function () {

    var aGist = new Gh3.Gist({id:"1096826"})
    ,    numberOfFiles = 0
    ,    numberOfComments = 0;


    it("should have some files", function () {

        runs(function () {

            aGist.fetch(function (err, res) {

                if(err) { throw "outch ..."; }

                console.log("aGist : ", aGist);
                console.log("Files : ", aGist.files);

                aGist.files.each(function (file) {
                    console.log(file.filename, file.language, file.type, file.size);
                    numberOfFiles ++;
                });

            });
        },"asynchronous method : fetch()");

        waitsFor(function () {
            return numberOfFiles > 0;
        }, "...", 1000);

        runs(function () {
            expect(numberOfFiles).toBeGreaterThan(0);
            expect(numberOfFiles).toEqual(aGist.files.length());
        });

    });

    it("should have some comments", function () {

        runs(function () {
            aGist.comments.fetch(function (err, res) {

                if(err) { throw "outch ..."; }

                aGist.comments.each(function (comment) {
                    console.log(comment.body, "By ", comment.user.login);
                    numberOfComments ++;
                });
            });

        },"asynchronous method : comments.fetch()");

        waitsFor(function () {
            return numberOfComments > 0;
        }, "...", 1000);

        runs(function () {
            expect(numberOfComments).toBeGreaterThan(0);
            if (typeof aGist.comment_count != 'undefined') {
                expect(numberOfComments).toEqual(aGist.comment_count);
            }
            expect(numberOfComments).toEqual(aGist.comments.length());
        });

    });

});
