
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
    ,   defunkt = new Gh3.User("defunkt")
    ,   members = []
    ,   orgs = [];

    it("org github should have more that 10 members", function() {
        runs(function () {

            github.fetchMembers(function (err, res){
                if(err) { throw "outch ..."; }
                members = res.members;
            });

        }, "asynchronous method: fetchMembers");

        waitsFor(function () {
            return members.length > 0;
        }, "...", 1000);

        runs(function() {
            expect(github.members.length).toBeGreaterThan(20);
            expect(members.length).toBeGreaterThan(20);
        });
    });

    it("user defunkt should have at least one org", function() {
        runs(function () {

            defunkt.fetchOrgs(function (err, res){
                if(err) { throw "outch ..."; }
                orgs = res.orgs;
            });

        }, "asynchronous method: fetchOrgs");

        waitsFor(function () {
            return orgs.length > 0;
        }, "...", 1000);

        runs(function() {
            expect(defunkt.orgs.length).toBeGreaterThan(1);
            expect(orgs.length).toBeGreaterThan(1);
        });
    });

});

describe("Fetch following and followers of a github user", function() {
    var k33g = new Gh3.User("k33g")
    ,   followers = []
    ,   following = [];

    it("should have many followers", function () {

        runs(function () {

            k33g.fetchFollowers(function (err, res) {
                if(err) { throw "outch ..."; }
                followers = res.followers;
            }, "asynchronous method: fetchFollowers");

        });

        waitsFor(function() {
            return followers.length > 0;
        }, "...", 1000);

        runs(function() {
            expect(k33g.followers.length).toBeGreaterThan(10);
        });

    });

    it("should have many following", function () {

        runs(function () {

            k33g.fetchFollowing(function (err, res) {
                if(err) { throw "outch ..."; }
                following = res.following;
            }, "asynchronous method: fetchFollowing");

        });

        waitsFor(function() {
            return following.length > 0;
        }, "...", 1000);

        runs(function() {
            expect(k33g.following.length).toBeGreaterThan(10);
        });

    });

});

describe("Fetch starred repositories of a github user", function() {
    var k33g = new Gh3.User("k33g")
    ,   starred = [];

    it("should have many starred repositories", function () {

        runs(function () {

            k33g.fetchStarred(function (err, res) {
                if(err) { throw "outch ..."; }
                starred = res.starred;
            }, "asynchronous method: fetchStarred");

        });

        waitsFor(function() {
            return starred.length > 0;
        }, "...", 1000);

        runs(function() {
            expect(k33g.starred.length).toBeGreaterThan(10);
        });

    });

});

describe("Fetch events emited and received by github user", function() {
    var k33g = new Gh3.User("k33g")
    ,   events = []
    ,   received_events = [];

    it("should have emited many events", function () {

        runs(function () {

            k33g.fetchEvents(function (err, res) {
                if(err) { throw "outch ..."; }
                events = res.events;
            }, "asynchronous method: fetchEvents");

        });

        waitsFor(function() {
            return events.length > 0;
        }, "...", 1000);

        runs(function() {
            expect(k33g.events.length).toBeGreaterThan(10);
        });

    });

    it("should have received many events", function () {

        runs(function () {

            k33g.fetchReceivedEvents(function (err, res) {
                if(err) { throw "outch ..."; }
                received_events = res.received_events;
            }, "asynchronous method: fetchReceivedEvents");

        });

        waitsFor(function() {
            return received_events.length > 0;
        }, "...", 1000);

        runs(function() {
            expect(k33g.received_events.length).toBeGreaterThan(10);
        });

    });

});

/*-----------------------------
    Users
-----------------------------*/

describe("Search users by keyword mad", function() {


    it("should be more than 10 on first page", function () {

        var numberOfUsers = 0;

        runs(function () {
            Gh3.Users.search("mad", {start_page : 1}, function (err, response) {
                if(err) { throw "outch ..."; }
                //numberOfUsers = response.getAll().length;
                //console.log(numberOfUsers);
                response.each(function (user) {
                    //console.log(user.name, user.login, user.repos, user)
                    numberOfUsers ++;
                });

            });
        }, "asynchronous method : search()");

        waitsFor(function () {
            return numberOfUsers > 10;
        }, "...", 1000);

        runs(function () {
            expect(numberOfUsers).toBeGreaterThan(10);
        });
    });

    it("should be more than 10 on third page", function () {

        var numberOfUsers = 0;

        runs(function () {
            Gh3.Users.search("mad", {start_page : 3}, function (err, response) {
                if(err) { throw "outch ..."; }
                response.each(function (user) {
                    numberOfUsers ++;
                });

            });
        }, "asynchronous method : search()");

        waitsFor(function () {
            return numberOfUsers > 10;
        }, "...", 1000);

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
    var k33g = new  Gh3.User("k33g")
    ,    k33gRepositories = new Gh3.Repositories(k33g);

    it("should have more than 20 public repositories", function () {
        runs(function () {

            k33gRepositories.fetch({page:1, per_page:100, direction : "desc"},"next", function (err, res) {
                if(err) { throw "outch ..."; }
                console.log("Repositories", k33gRepositories);
                console.log("TOTAL : ", k33gRepositories.getRepositories().length);
            });


        }, "asynchronous method : fetch()");

        waitsFor(function () {
            return k33gRepositories.getRepositories().length > 20;
        }, "...", 1000);

        runs(function () {
            expect(k33gRepositories.getRepositories().length).toBeGreaterThan(20);
        });

    });

});

describe("Search public repositories by keyword : pdf", function () {
    var numberOfFoundRepositories = 0;

    it("should find more than 30 public repositories on page 2", function () {


        runs(function () {

            Gh3.Repositories.search("pdf", {start_page : 2}, function (err, res) {
                if(err) { throw "outch ..."; }

                Gh3.Repositories.each(function (repository) {
                    numberOfFoundRepositories ++;
                });

                console.log(numberOfFoundRepositories);
            });


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
    ,   gh3Repo = new Gh3.Repository("gh3", k33g)
    ,   contributors = [];

    it("should have some contributors, including k33g, with number of contributions", function () {

        runs(function () {

            gh3Repo.fetchContributors(function (err, res) {
                if(err) { throw "outch ..."; }
                contributors = res.getContributors();
                console.log(gh3Repo);
            });

        }, "asynchronous method : fetchContributors()");

        waitsFor(function () {
            return contributors.length > 0;
        }, "...", 1000);

        runs(function () {
            var k33g_ = gh3Repo.getContributorByLogin('k33g');
            expect(contributors.length).toBeGreaterThan(1);
            expect(k33g_.login).toEqual('k33g');
            expect(k33g_.contributions).toBeGreaterThan(20);
        });

    });

});

describe("get gh3 forks", function() {

    var k33g = new Gh3.User("k33g")
    ,   gh3Repo = new Gh3.Repository("gh3", k33g)
    ,   forks = [];

    it("should have some forks", function () {

        runs(function () {

            gh3Repo.fetchForks(function (err, res) {
                if(err) { throw "outch ..."; }
                forks = res.getForks();
                console.log(gh3Repo);
            });

        }, "asynchronous method : fetchForks()");

        waitsFor(function () {
            return forks.length > 0;
        }, "...", 1000);

        runs(function () {
            expect(forks.length).toBeGreaterThan(0);
        });

    });

});

describe("get gh3 stargazers", function() {

    var k33g = new Gh3.User("k33g")
    ,   gh3Repo = new Gh3.Repository("gh3", k33g)
    ,   stargazers = [];

    it("should have some stargazers", function () {

        runs(function () {

            gh3Repo.fetchStargazers(function (err, res) {
                if(err) { throw "outch ..."; }
                stargazers = res.getStargazers();
                console.log(gh3Repo);
            });

        }, "asynchronous method : fetchStargazers()");

        waitsFor(function () {
            return stargazers.length > 0;
        }, "...", 1000);

        runs(function () {
            expect(stargazers.length).toBeGreaterThan(10);
        });

    });

});

describe("Fetch events related to a repository", function() {
    var k33g = new Gh3.User("k33g")
    ,   gh3Repo = new Gh3.Repository("gh3", k33g)
    ,   events = [];

    it("should have many events", function () {

        runs(function () {

            gh3Repo.fetchEvents(function (err, res) {
                if(err) { throw "outch ..."; }
                events = res.events;
            }, "asynchronous method: fetchEvents");

        });

        waitsFor(function() {
            return events.length > 0;
        }, "...", 1000);

        runs(function() {
            expect(gh3Repo.events.length).toBeGreaterThan(10);
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
    ,     master;

    it("should have several contents", function () {

        runs(function () {

            k33gBlog.fetch(function (err, res) {
                if(err) { throw "outch ..."; }

                console.log("k33gBlog : ", k33gBlog);
                k33gBlog.fetchBranches(function (err, res) {
                    if(err) { throw "outch ..."; }

                    master = k33gBlog.getBranchByName("master");

                    console.log("master : ", master);

                    master.fetchContents(function (err, res) {
                        if(err) { throw "outch ..."; }

                        console.log(master.getContents());
                        numberOfContents = master.getContents().length;
                    });

                });
            });

        }, "asynchronous method : fetchContents()");

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

                k33gBlog.fetchBranches(function (err, res) {
                    if(err) { throw "outch ..."; }

                    master = k33gBlog.getBranchByName("master");

                    master.fetchContents(function (err, res) {
                        if(err) { throw "outch ..."; }
                        myfile = master.getFileByName("index.html");

                        myfile.fetchContent(function (err, res) {
                            if(err) { throw "outch ..."; }
                            rawContent = myfile.getRawContent();
                        });
                    });

                });
            });

        }, "asynchronous method : fetchContents()");

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
            myfile.fetchCommits(function (err, res) {
                if(err) { throw "outch ..."; }

                console.log(myfile.getCommits());

                myfile.eachCommit(function (commit) {
                    console.log(commit.author.login, commit.message, commit.date);
                    numberOfCommits ++;
                });
            });
        }, "asynchronous method : fetchCommits()");

        waitsFor(function () {
            return numberOfCommits > 0;
        }, "...", 1000);

        runs(function () {
            expect(numberOfCommits).toBeGreaterThan(0);
        });

    });

    it("should have a _post diretory with contents", function () {
        var numberOfContentsInDirectory = 0;

        runs(function () {
            dir = master.getDirByName('_posts');

            dir.fetchContents(function (err, res) {
                if(err) { throw "outch ..."; }

                console.log(dir.getContents());

                dir.eachContent(function (content) {
                    console.log(content.name, content.type, content.size);
                    numberOfContentsInDirectory ++;
                });
            });

        },"asynchronous method : fetchContents()");

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
    var GistsOfK33g = new Gh3.Gists(new Gh3.User("k33g"))
    , numberOfFoundGists = 0;


    it("should have more than 3 gists on page next to page 2", function () {

        runs(function () {
            GistsOfK33g.fetch({page:2, per_page:5}, "next", function (err, res) {

                if(err) { throw "outch ..."; }

                console.log(GistsOfK33g.getGists());

                GistsOfK33g.eachGist(function (gist) {
                    //console.log(gist.description, gist.id);
                    numberOfFoundGists ++;
                });
            });

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

            aGist.fetchContents(function (err, res) {

                if(err) { throw "outch ..."; }

                console.log("aGist : ", aGist);
                console.log("Files : ", aGist.files);

                aGist.eachFile(function (file) {
                    console.log(file.filename, file.language, file.type, file.size);
                    numberOfFiles ++;
                });

            });
        },"asynchronous method : fetchContents()");

        waitsFor(function () {
            return numberOfFiles > 0;
        }, "...", 1000);

        runs(function () {
            expect(numberOfFiles).toBeGreaterThan(0);
        });

    });

    it("should have some comments", function () {

        runs(function () {
            aGist.fetchComments(function (err, res) {

                if(err) { throw "outch ..."; }

                aGist.eachComment(function (comment) {
                    console.log(comment.body, "By ", comment.user.login);
                    numberOfComments ++;
                });
            });

        },"asynchronous method : fetchComments()");

        waitsFor(function () {
            return numberOfComments > 0;
        }, "...", 1000);

        runs(function () {
            expect(numberOfComments).toBeGreaterThan(0);
        });

    });

});
