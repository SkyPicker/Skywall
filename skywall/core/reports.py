import inspect
from skywall.core.signals import Signal


reports_registry = {}

before_report_collect = Signal('before_report_collect')
after_report_collect = Signal('after_report_collect')


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
            report = reports_registry[name]
            before_report_collect.emit(report=report)
            res[name] = report.collect()
            after_report_collect.emit(report=report, value=res[name])
        except Exception as e:
            print('Collecting report "{}" failed: {}'.format(name, e), flush=True)
    return res


class AbstractReport:
    name = None
    label = None

    def collect(self):
        return None
