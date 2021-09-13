#!make

TAG = $(shell git describe --tags | sed -e 's/^v//')

PRERELEASE_TAG ?= rc
PUBLISH_FLAGS = publish --access public

PACKAGE_LOCK = package-lock.json
COVERAGE = .nyc_output coverage
SRC = src
DIST = dist
MODULES = node_modules node_modules/.bin

DOCKER_SERVICE = dev
D = docker
DC = docker-compose
DCFLAGS = --rm ${DOCKER_SERVICE}

PM = $(DC) run $(DCFLAGS) npm
RM = $(DC) run $(DCFLAGS) rm
ifneq "$(or $(wildcard /.dockerenv), $(CI))" ""
	PM = npm
	RM = rm
endif

all: $(DIST)
.PHONY: all

$(MODULES):
	$(PM) ci

$(DIST): $(MODULES)
	$(PM) run build

coverage:
	$(PM) run coverage

package-lock.json:
	$(PM) i

clean:
	$(RM) -rf $(DIST)
.PHONY: clean

clean-coverage:
	$(RM) -rf $(COVERAGE)
.PHONY: clean-coverage

clean-modules:
	$(RM) -rf $(MODULES)/*
	$(RM) $(PACKAGE_LOCK)
.PHONY: clean-modules

clean-all: clean clean-modules clean-coverage
.PHONY: clean-all

test: $(MODULES)
	$(PM) t
.PHONY: test

container: package-lock.json
	$(DC) build ${DOCKER_SERVICE}
.PHONY: container

shell:
ifneq (,$(wildcard /.dockerenv))
	bash
else
	$(DC) run $(DCFLAGS) bash
endif
.PHONY: shell

release:
ifneq (,$(findstring n,$(MAKEFLAGS)))
	+npx standard-version -s --dry-run
	+npm $(PUBLISH_FLAGS) --dry-run
else
	npx standard-version -s
	+npm $(PUBLISH_FLAGS)
endif
.PHONY: release

prerelease:
ifneq (,$(findstring n,$(MAKEFLAGS)))
	+npx standard-version -s --prerelease $(PRERELEASE_TAG) --dry-run
	+npm $(PUBLISH_FLAGS) --tag $(PRERELEASE_TAG) --dry-run
else
	npx standard-version -s --prerelease $(PRERELEASE_TAG)
	+npm $(PUBLISH_FLAGS) --tag $(PRERELEASE_TAG)
endif
.PHONY: prerelease
