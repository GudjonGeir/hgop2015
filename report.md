### Vagrant
Vagrant er notað til þess að hafa tilbúið þróunarumhverfi í sýndarvél. Þetta er gert til þess að auðvelda uppsetningu á nýjum vélum og koma í veg fyrir "Works on my machine" afsökunum.
### VirtualBox
VirtualBox heldur utan um og keyrir sýndarvélar.
### Grunt
Grunt er "task runner", þ.e.a.s. það keyrir verkefni sem má gera sjálfvirkt, t.d. einingapróf og þýða kóða.
### npm
npm er package manager, og gerir forriturum kleift að deila og nota kóða eða library frá hvorum öðrum.
### nodejs
nodejs er framework fyrir javascript, sem keyrir á einum þræði og er event-driven.
### bower
bower er svipað og npm nema að það er eingöngu fyrir biðlara (client).

### Topology
Við erum með tvær Vagrant vélar, önnur er fyrir þróunarumhverfi og jenkins, og hin fyrir prófunarumhverfi. Docker er container sem þessar vélar nota til þess að keyra upp verkefnið.
Jenkins sér um continuous-deployment, s.s. fylgist með GitHub repo-inu og þegar breytingum er ýtt þangað sækir það breytingarnar og keyrir npm install til að fá server side dependencies, bower install til að fá client side dependencies og að lokum grunt til þess að byggja verkefnið og prófa það. Ef að prófin standast þá smíðar Jenkins dockerfile sem hann sendir síðan á Dockerhub og sendir síðan skilaboð á prófunar umhverfið að sæka hann og keyra upp.
