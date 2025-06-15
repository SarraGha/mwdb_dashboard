# MWDB Core

## [Installation ⚙️](https://mwdb.readthedocs.io/en/latest/setup-and-configuration.html) | [Docs 📚](https://mwdb.readthedocs.io/en/latest/) | [Guide 📕](https://mwdb.readthedocs.io/en/latest/user-guide/index.html)
---

Malware repository component for automated malware collection/analysis systems. 

Formerly known as Malwarecage.

Under the hood of [mwdb.cert.pl service](https://mwdb.cert.pl) hosted by CERT.pl.

## Setup & documentation

If you want to learn more about setting up your own mwdb-core instance or mwdb.cert.pl service: go to the [mwdb-core documentation](https://mwdb.readthedocs.io/en/latest/).

## Features

- Storage for malware binaries and static/dynamic malware configurations
- Tracking and visualizing relations between objects
- Quick search
- Data sharing and user management mechanism
- Integration capabilities via webhooks and plugin system

**Query your malware dataset with ease**

![](docs/_static/44dwH7g.gif)

![](docs/_static/uRL9dt6.gif)

**Convenient interface for your own analysis backend**

![](docs/_static/whJxE0j.png)

**Store configurations in organized way**

![](docs/_static/eMmEaQo.png)

**Visualize relationship between objects**

![](docs/_static/XPiIboW.gif)

## Contact

If you have any problems, bugs or feature requests related to MWDB, you're encouraged to create a GitHub issue. If you have other questions, question is related strictly with mwdb.cert.pl service or you want to contact the current maintainers directly, you can email:

- Paweł Srokosz (psrok1@cert.pl)
- CERT.PL (info@cert.pl)

## License

This software is licensed under [GNU Affero General Public License version 3](http://www.gnu.org/licenses/agpl-3.0.html) except for plugins.

For more information, read [LICENSE](LICENSE) file.

In case of any questions regarding the license send an e-mail to info@cert.pl.

![Co-financed by the Connecting Europe Facility by of the European Union](https://www.cert.pl/uploads/2019/02/en_horizontal_cef_logo-e1550495232540.png)


---

## 🧪 Student Project: P9. MWDB Dashboard

As part of the **P9. Mwdb Dashboard** project, this customization of MWDB adds a new configurable dashboard to the platform, enabling users to better understand and analyze the characteristics of their collected malware dataset.

### 🔍 Purpose

MWDB is widely used to manage malware sample repositories, but lacked a visual dashboard for aggregated statistics. This project adds that functionality, aligned with the educational goal of extending MWDB’s frontend/backend architecture.

### 📊 Key Additions

- ✅ **New `/dashboard` route** with a user interface built using **React + Chart.js**.
- ✅ **Dynamic charts** (e.g. bar graphs) to display:
  - Malware file type distribution.
  - (Extendable to show tag frequency, uploads over time, etc.)
- ✅ **Backend API** `/api/stats/count_by_type` added via Flask to serve statistical data.
- ✅ Fully integrated into MWDB's authentication and permission system.

> Developed for a university forensics project by: **Sarra Gharsallah**  
> Timeline: **SPRING 2025**  
> Based on original MWDB project by CERT-Polska ([mwdb.cert.pl](https://mwdb.cert.pl))

