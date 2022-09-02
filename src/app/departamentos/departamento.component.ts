import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from './models/departamento.model';
import { DepartamentoService } from './services/departamento.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html'
})
export class DepartamentoComponent implements OnInit {
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(
    private departamentoService: DepartamentoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      nome: new FormControl(""),
      telefone: new FormControl("")
    })
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id() {
    return this.form.get("id");
  }

  get nome() {
    return this.form.get("nome");
  }

  get telefone() {
    return this.form.get("telefone");
  }

  public async gravar(modal: TemplateRef<any>, departamento?: Departamento) {
    this.form.reset();

    if (departamento)
      this.form.setValue(departamento);

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        if (!departamento)
        {
          await this.departamentoService.inserir(this.form.value)
          this.toastrService.success("O departamento foi inserido com sucesso", "Inserção de Departamentos");
        }
        else
        {
          await this.departamentoService.editar(this.form.value);
          this.toastrService.success("O departamento foi editado com sucesso", "Edição de Departamentos");
        }
      }

    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error("Houve um erro ao tentar salvar o Equipamento! Tente novamente.", "Cadastro de Departamentos")
    }

  }

  public excluir(departamento: Departamento) {
    try {
      this.departamentoService.excluir(departamento);
      this.toastrService.success("O departamento foi excluido com sucesso!", "Exclusão de Departamentos");
    } catch (error) {
      this.toastrService.error("Houve um erro ao tentar excluir o Departamento! Tente novamente.", "Exclusão de Departamentos");
    }
  }

}
