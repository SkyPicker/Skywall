import inspect


reports_registry = {}


def register_report(report):
    assert report.name not in reports_registry
    reports_registry[report.name] = report
    return report

def collect_report():
    res = {}
    for name in reports_registry:
        try:
            # Instantiate the report class on the first use
            if inspect.isclass(reports_registry[name]):
                reports_registry[name] = reports_registry[name]()
            res[name] = reports_registry[name].collect()
        except Exception as e:
            print('Collecting report "{}" failed: {}'.format(name, e))
    return res


class AbstractReport:
    name = None

    def collect(self):
        return None
