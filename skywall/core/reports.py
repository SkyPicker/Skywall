reports = {}


def register_report(report):
    assert report.name not in reports
    reports[report.name] = report
    return report

def collect_report():
    res = {}
    for name in reports:
        try:
            res[name] = reports[name].collect()
        except Exception as e:
            print('Collecting report "{}" failed: {}'.format(name, e))
    return res


class AbstractReport:
    name = None

    @staticmethod
    def collect():
        return None
