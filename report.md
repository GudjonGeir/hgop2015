## Vagrant
Vagrant er notað til þess að hafa tilbúið þróunarumhverfi í sýndarvél. Þetta er gert til þess að auðvelda uppsetningu á nýjum vélum og koma í veg fyrir "Works on my machine" afsökunum.
## VirtualBox
VirtualBox heldur utan um og keyrir sýndarvélar.
## Grunt
Grunt er "task runner", þ.e.a.s. það keyrir verkefni sem má gera sjálfvirkt, t.d. einingapróf og þýða kóða.
## npm
npm er package manager, og gerir forriturum kleift að deila og nota kóða eða library frá hvorum öðrum.
## nodejs
nodejs er framework fyrir javascript, sem keyrir á einum þræði og er event-driven.
## bower
bower er svipað og npm nema að það er eingöngu fyrir biðlara (client).

## Topology
Við erum með tvær Vagrant vélar, önnur er fyrir þróunarumhverfi og jenkins, og hin fyrir prófunarumhverfi. Docker er container sem þessar vélar nota til þess að keyra upp verkefnið.
Jenkins sér um continuous-deployment, s.s. fylgist með GitHub repo-inu og þegar breytingum er ýtt þangað sækir það breytingarnar og keyrir npm install til að fá server side dependencies, bower install til að fá client side dependencies og að lokum grunt til þess að byggja verkefnið og prófa það. Ef að prófin standast þá smíðar Jenkins dockerfile sem hann sendir síðan á Dockerhub og sendir síðan skilaboð á prófunar umhverfið að sæka hann og keyra upp.

## Load/Capacity Test
Eftir að hafa keyrt capacity prófið nokkrum sinnum var niðustaðan að það tekur um það bil 8 sekúndur að spila 300 leiki. Ég setti efri mörkin á 10 sekúndur.

####Keyrir prófið samhliða eða í röð? 
Prófið keyrir samhliða út af því að nodejs er 'asynchronous', þ.e. þegar það á að gera I/O aðgerð þá setur það aðgerðina í bakgrunninn og heldur áfram keyrslu þangað til að það fær 'interrupt' að I/O aðgerðin hafi klárast. Í okkar tilviki þá fer hvert leikur í bakgrunnin þangað til að 'interrupt-ið' kemur. Í millitíðinni gæti annar leikur byrjað.

## Traceability/Deploy any version
#### What does this give us?
Þetta gefur okkur continuous deployment, þar sem hvert commit sem er push-að fer rakleiðis á production að því gefnu að öll próf standast. Einnig gefur þetta okkur traceability þannig að hvert deployment er tengt við version control commit.
#### Who would use the capability to track versions and why? Who would use capability to deploy any version and why?
Prófarar geta valið gamlar útgáfur til að staðfesta breytingar. Support staff geta deployað útgáfu til að endurskapa galla. Ops geta valið útgáfu sem er vitað sé góð til að deploya í production sem disaster recovery. Traceability gefur þessum aðilum möguleikann að "sjá utan á kassanum" hvaða version þeir þurfa.

#### What was wrong with having docker push in the deployment script rather than in the dockerbuild.sh script?
Til þess traceability-ið og build promotion virki rétt þá þarf að einkenna docker image-ið við version control útgáfuna þegar það var buildað. Þetta gerist í commit stageinu, s.s. þegar dockerbuild.sh er keyrt.
#### How does the "deploy any version, anywhere" build feature work? Hint: Track GIT_COMMIT
Til þess að geta deployað hvaða útgáfu sem er þarf bara að fara í gegnum commit söguna á git, finna git hashið á viðeigandi commit-i, og bera það saman við build-pipeline söguna. Þegar rétt útgáfa er fundin þar er hægt að rebuild-a því build-i.

## Deployment pipeline

### Commit stage
```
export DISPLAY=:0
npm install
bower install
./dockerbuild.sh
```

### Acceptance stage
```
export GIT_UPSTREAM_HASH=$(<dist/githash.txt)
env
./deploy.sh 192.168.33.10 9000 $GIT_UPSTREAM_HASH
```
```
./acceptance-test.sh 192.168.33.10 9000
```

### Capacity stage
```
cat dist/githash.txt
./capacity-test.sh 192.168.33.10 9000
```

### Production stage
```
export GIT_UPSTREAM_HASH=$(<dist/githash.txt)
env
./deploy.sh 192.168.33.10 9001 $GIT_UPSTREAM_HASH
```