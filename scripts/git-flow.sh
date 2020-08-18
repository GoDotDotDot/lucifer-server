#!/bin/usr bash

git config gitflow.branch.master master
git config gitflow.branch.develop dev
git config gitflow.prefix.feature feat-
git config gitflow.prefix.bugfix fix-
git config gitflow.prefix.release release-
git config gitflow.prefix.hotfix hotfix-
git config gitflow.prefix.support support-
git config gitflow.prefix.versiontag

git flow init -d