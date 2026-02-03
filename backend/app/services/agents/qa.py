class QACriticAgent:
    def run(self, artifacts, validators):
        for validator in validators:
            for artifact in artifacts:
                if not validator.validate(artifact):
                    return False
        return True