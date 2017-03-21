reports_registry = {}


def register_report(report):
    assert report.name not in reports_registry
    reports_registry[report.name] = report
    return report

def collect_report():
    res = {}
    for name in reports_registry:
        try:
            res[name] = reports_registry[name].collect()
        except Exception as e:
            print('Collecting report "{}" failed: {}'.format(name, e))
    return res


class AbstractReport:
    name = None

    @staticmethod
    def collect():
        return None
